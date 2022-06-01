const canvas = document.getElementById('canvas')

canvas.width = 425
canvas.height = 425

let context = canvas.getContext("2d")
let default_bg_color = "white"

context.fillStyle = default_bg_color
context.fillRect(0, 0, canvas.width, canvas.height)

let draw_color = "black"
let draw_width = "2"
let is_drawing = false

canvas.addEventListener("touchstart", start, false)
canvas.addEventListener("touchmove", draw, false)
canvas.addEventListener("mousedown", start, false)
canvas.addEventListener("mousemove", draw, false)
canvas.addEventListener("mouseup", stop, false)
canvas.addEventListener("mouseout", stop, false)

function start(event)
{
    console.log("Drawing")

    is_drawing = true

    context.beginPath()
    console.log(event.clientX, event.clientY) 
    console.log(canvas.offsetLeft, canvas.offsetTop)
    
    context.moveTo(event.clientX - canvas.offsetLeft, 
        event.clientY - canvas.offsetTop)

    event.preventDefault()
}

function draw(event)
{
    if (is_drawing)
    {
        context.lineTo(event.clientX - canvas.offsetLeft, 
                       event.clientY - canvas.offsetTop)
        context.strokeStyle = draw_color
        context.lineWidth = draw_width
        context.lineCap = "round"
        context.lineJoin = "round"
        context.stroke()
    }
    event.preventDefault()
}

function stop(event)
{
    if (is_drawing)
    {
        context.stroke()
        context.closePath()
        is_drawing = false

        saveImage()
    }

    event.preventDefault()
}

function change_color(element)
{
    draw_color = element.style.background;
}

function clear_canvas()
{
    context.fillStyle = default_bg_color
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillRect(0, 0, canvas.width, canvas.height)
}


function saveImage()
{    
    var image = new Image()
    var url = document.getElementById('url')
    image.id = "pic"
    image.src = canvas.toDataURL("image/png")
    url.value = image.src

    console.log(url.value)

    $.ajax({
        url:'/draw',
        type:'POST',
        contentType: 'application/octet/stream',
        data: url.value.split(',')[1],
    });
}

