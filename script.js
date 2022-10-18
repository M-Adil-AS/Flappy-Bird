let pipes = document.querySelectorAll('.pipe')
let lowerPipes = Array.from(pipes).filter(pipe => pipe.id.includes('L'))
let upperPipes = Array.from(pipes).filter(pipe => pipe.id.includes('U'))
let firstGroupOfPipes = Array.from(document.querySelectorAll('.pipe')).slice(0,10)
let secondGroupOfPipes = Array.from(document.querySelectorAll('.pipe')).slice(10,20)
let marginLeftValuesOfPipes = [105.6,105.6,384.8,384.8,664,664,943.2,943.2,1222.4,1222.4,1501.6,1501.6,1780.8,1780.8,2060,2060,2339.2,2339.2,2618.4,2618.4]
let birdImg = document.querySelector('#birdImg')
let birdCollider = document.querySelector('#birdCollider')
let fallInterval 
let riseInterval 
let mainInterval
let allowedToRise = true
let allowedToStart = true

document.addEventListener('keydown', (e)=>{
    if(e.keyCode == 32){
        e.preventDefault()
        if(allowedToStart){
            main()
            allowedToStart = false
            document.querySelector('#instruction').style.display = 'none'
        }
        if(allowedToRise){
            rise(e)
        }
    }
})

document.addEventListener('click',(e)=>{
    if(e.target.id=='replay'){
        window.location.reload()
    }
})

function rise(e){ 
    let iterations = 0
    clearInterval(fallInterval)
    clearInterval(riseInterval)
    birdImg.src = 'rising.png'
    if(!e.repeat){
        new Audio('rise.wav').play()
    }

    riseInterval = setInterval(()=>{
        birdImg.style.marginTop = `${Number(birdImg.style.marginTop.split('px')[0])-2.5}px`
        birdCollider.style.marginTop = `${Number(birdCollider.style.marginTop.split('px')[0])-2.5}px`
        iterations++
        if(iterations==20){         
            clearInterval(riseInterval)
            fall()
        }
    },10)
}

function fall(){
    birdImg.src = 'falling.png'
    fallInterval = setInterval(()=>{
        birdImg.style.marginTop = `${Number(birdImg.style.marginTop.split('px')[0])+2.5}px`
        birdCollider.style.marginTop = `${Number(birdCollider.style.marginTop.split('px')[0])+2.5}px`
    },10)
}

pipes.forEach((pipe,index)=>{
    pipe.style.marginLeft = `${marginLeftValuesOfPipes[index]}px`
})

lowerPipes.forEach((pipe)=>{
    pipe.style.marginTop = ` ${Math.floor(Math.random() * (501 - 245)) + 245}px`
    pipe.style.clipPath = `inset(0px 0px ${155+pipeTop(pipe)}px 0px)`
})

upperPipes.forEach((pipe,index)=>{
    pipe.style.marginTop = `${pipeTop(lowerPipes[index])-900}px`
})

firstGroupOfPipes.forEach((pipe)=>{
    pipe.style.visibility = 'hidden'
})

document.querySelector('#bg-img-1').style.marginLeft = '0px'
document.querySelector('#bg-img-2').style.marginLeft = '1396px'
birdImg.style.marginTop = '150px'
birdImg.style.marginLeft = '400px'
birdCollider.style.marginTop = '161px'
birdCollider.style.marginLeft = '410px'

function main(){
    mainInterval = setInterval(()=>{
        document.querySelector('#bg-img-1').style.marginLeft = `${document.querySelector('#bg-img-1').style.marginLeft.split('px')[0]-2}px`
        document.querySelector('#bg-img-2').style.marginLeft = `${document.querySelector('#bg-img-2').style.marginLeft.split('px')[0]-2}px`

        if(document.querySelector('#bg-img-2').style.marginLeft=='0px'){
            document.querySelector('#bg-img-1').style.marginLeft = '0px'
            document.querySelector('#bg-img-2').style.marginLeft = '1396px'

            firstGroupOfPipes.forEach((pipe)=>{
                pipe.style.visibility = 'visible'
            })

            firstGroupOfPipes.forEach((pipe,index)=>{
                pipe.style.marginLeft = secondGroupOfPipes[index].style.marginLeft
                pipe.style.marginTop = secondGroupOfPipes[index].style.marginTop
                pipe.style.clipPath = secondGroupOfPipes[index].style.clipPath
            })

            let marginLeftValuesOfSecondGroupOfPipes = marginLeftValuesOfPipes.slice(10,20)

            secondGroupOfPipes.forEach((pipe,index)=>{
                pipe.style.marginLeft = `${marginLeftValuesOfSecondGroupOfPipes[index]}px`
            })

            let secondGroupUpperPipes = secondGroupOfPipes.filter(pipe => pipe.id.includes('U'))
            let secondGroupLowerPipes = secondGroupOfPipes.filter(pipe => pipe.id.includes('L'))

            secondGroupLowerPipes.forEach((pipe)=>{
                pipe.style.marginTop = ` ${Math.floor(Math.random() * (501 - 245)) + 245}px`
                pipe.style.clipPath = `inset(0px 0px ${155+pipeTop(pipe)}px 0px)`
            })

            secondGroupUpperPipes.forEach((pipe,index)=>{
                pipe.style.marginTop = `${pipeTop(secondGroupLowerPipes[index])-900}px`
            }) 
        }

        pipes.forEach((pipe)=>{
            pipe.style.marginLeft = `${pipeLeft(pipe)-2}px`
            if((Math.trunc(pipeLeft(pipe))==320 || Math.trunc(pipeLeft(pipe))==321) && pipe.style.visibility!='hidden' && pipe.id.includes('L')){
                document.querySelector('#scoreValue').innerHTML = Number(document.querySelector('#scoreValue').innerHTML)+1
            }
        })

        //collision detection
        let R = 16
        let Cx = Number(birdCollider.style.marginLeft.split('px')[0]) + R
        let Cy = Number(birdCollider.style.marginTop.split('px')[0]) + R
        let G1y = 622
        let pipeWidth = 67
        let pipeHeight = 778

        upperPipes.forEach((pipe)=>{
            if(pipe.style.visibility != 'hidden'){
                let V1x = pipeLeft(pipe)
                let V1y = pipeTop(pipe) + pipeHeight
                let V2x = V1x + pipeWidth
                let V2y = V1y  

                //case 1
                if(Cx<=V1x && Cy<=V1y){
                    let Px = V1x
                    let Py = Cy
                    let D = Px-Cx
                    if(D<R){
                        gameOver()
                    }
                }

                //case 2
                else if(Cx<V1x && Cy>V1y){
                    let Px = V1x
                    let Py = V1y
                    let D = Math.sqrt(Math.pow(Cx-Px,2)+Math.pow(Cy-Py,2))
                    if(D<R){
                        gameOver()
                    }
                }

                //case 3
                else if(Cx>=V1x && Cx<=V2x && Cy>=V1y){
                    let Px = Cx
                    let Py = V1y
                    let D = Cy-Py
                    if(D<R){
                        gameOver()
                    }
                }  

                //case 4
                else if(Cx>V2x && Cy>=V2y){
                    let Px = V2x
                    let Py = V2y
                    let D = Math.sqrt(Math.pow(Cx-Px,2)+Math.pow(Cy-Py,2))
                    if(D<R){
                        gameOver()
                    }
                }
            }
        })

        lowerPipes.forEach((pipe)=>{
            if(pipe.style.visibility != 'hidden'){
                let V1x = pipeLeft(pipe)
                let V1y = pipeTop(pipe) 
                let V2x = V1x + pipeWidth
                let V2y = V1y

                //case 1
                if(Cx<=V1x && Cy>=V1y){
                    let Px = V1x
                    let Py = Cy
                    let D = Px-Cx
                    if(D<R){
                        gameOver()
                    }
                }

                //case 2
                else if(Cx<V1x && Cy<V1y){
                    let Px = V1x
                    let Py = V1y
                    let D = Math.sqrt(Math.pow(Cx-Px,2)+Math.pow(Cy-Py,2))
                    if(D<R){
                        gameOver()
                    }
                }

                //case 3
                else if(Cx>=V1x && Cx<=V2x && Cy<=V1y){
                    let Px = Cx
                    let Py = V1y
                    let D = Py-Cy
                    if(D<R){
                        gameOver()
                    }
                }  

                //case 4
                else if(Cx>V2x && Cy<=V2y){
                    let Px = V2x
                    let Py = V2y
                    let D = Math.sqrt(Math.pow(Cx-Px,2)+Math.pow(Cy-Py,2))
                    if(D<R){
                        gameOver()
                    }
                }  
            }
        })

        if(G1y-Cy<R){
            gameOver()
        }
    },10)
}

function pipeLeft(pipe){
    return Number(pipe.style.marginLeft.split('px')[0])
} 

function pipeTop(pipe){
    return Number(pipe.style.marginTop.split('px')[0])
} 

function gameOver(){
    new Audio('hit.mp3').play()
    allowedToRise = false
    clearInterval(riseInterval)
    clearInterval(fallInterval)
    clearInterval(mainInterval)
    document.querySelector('#container').insertAdjacentHTML('beforeend',`
        <div id='modal-cover'>
            <div id='modal'>
                <div>SCORE: ${document.querySelector('#scoreValue').innerHTML}</div>
                <button id='replay'>REPLAY</button>
            </div>
        </div>
    `)
}