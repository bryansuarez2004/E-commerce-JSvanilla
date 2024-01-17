import './style.css'
import { productos } from './funcionalidades.js/productos'



function traerDatos() {
    localStorage.setItem('productos', JSON.stringify(productos))
    return productos
}
function pintarProductos(res){
    document.querySelector('#app').innerHTML = ''
    res.forEach((element) => {
        document.querySelector('#app').innerHTML += `
        <div class="product">
           <div class="product__img"><img class ="imgSelect" src=${element.imagen} alt=""></div>
           <div class="product__info">
            ${element.quantity ? `<div class ="boton__circular" id=${element.id}> + </div>` : `<div class = "product__soldOut">SOLD OUT</div>` }
           <div class="product__venta">${element.precio} ${element.quantity ? `<span class="product__cantidad">Stock: 
           ${element.quantity}</span>` : ''}</div>
           <div class="product__name">${element.nombre}</div>
           </div>
        </div>
        `
    });
}
function mostrarCarrito(){
    const carritoIcon = document.querySelector('.bx-cart')
    const carrito = document.querySelector('#cart')
    carritoIcon.addEventListener('click',()=>{
        carrito.classList.toggle('contentCartShow')
    })
}
function cerrarCarrito (){
    const cerrarCarritoIcon = document.querySelector('.bx-x')
  const carrito = document.querySelector('#cart')
     cerrarCarritoIcon.addEventListener('click',()=>{
        
        carrito.classList.remove('contentCartShow')
     })
}
function agregaProductosAlCarrito(res,productosDelCarrito){
    const botones = document.querySelectorAll('.boton__circular');
     botones.forEach((element)=>{
            element.addEventListener('click',(e)=>{
                productosDelCarrito = JSON.parse(localStorage.getItem('carrito')) || []
                 const ide = Number(e.target.id)
                const productoSeleccionado = res.find((element)=>{
                    return element.id === ide
                })
                
               const hay = productosDelCarrito.some((element)=>{
                          return element.id === ide
               })
               console.log(hay)
               if(hay){ 
                 let productoAumentar = productosDelCarrito.find((element)=>{
                    return element.id === ide
                })
                
                if(productoAumentar.cantidad !== productoAumentar.quantity){
                    productoAumentar.cantidad+=1
                   
                  
                   
                  localStorage.setItem('carrito',JSON.stringify(productosDelCarrito))
                  pintarProductosEnCarrito(productosDelCarrito)
                  pintarTotal(productosDelCarrito)
                  } else{
                    alert('no hay mas')
                  }

               } else{
                productosDelCarrito.push({...productoSeleccionado, cantidad: 1})
              localStorage.setItem('carrito', JSON.stringify(productosDelCarrito))
              
              console.log(productosDelCarrito.length)
              pintarProductosEnCarrito(productosDelCarrito)
              pintarTotal(productosDelCarrito)
               }
              
            })
        })

     
}
function pintarProductosEnCarrito(productosDelCarrito, subtotal){
    document.querySelector('#productosCarrito').innerHTML= ''
    productosDelCarrito.forEach((element)=>{
        subtotal = element.precio*element.cantidad
 
        document.querySelector('#productosCarrito').innerHTML+= `
        <div class="cartProduct" id="${element.id}">
        <div class="cartProduct__img">
             <img src=${element.imagen} alt="">
        </div>
        <div class="cartProduct__main">
              <h3 class="cartMain__tittle">${element.nombre}</h3>
              <div>
                   <span class="cartStock">Stock: ${element.quantity} </span> | <span class="cartPrice">$${element.precio}.00</span>
              </div>
              <div class="cartSubtotal"> Subtotal: $${subtotal||element.precio} </div>
              <div class="prodCart">
                   <span class="cartMinus">-</span><span class="cartUnits">units: ${element.cantidad}</span><span class="cartPlus">+</span>
              </div>        
        </div>
        <div class="trashCart">
        <i class='bx bx-trash'></i>
        </div>
     </div>   `
   }) 
}
function funcionalidadCartProduct(res,productosDelCarrito){
    const cartaDeProducto = document.querySelector('.productsCart')
      cartaDeProducto.addEventListener('click',(e)=>{
        
        
        if(e.target.classList.contains('bx-trash')){
            let productosDelCarrito = JSON.parse(localStorage.getItem('carrito')) || []
           const ide = e.target.parentElement.parentElement.id
           productosDelCarrito = productosDelCarrito.filter((element)=>{
            return element.id !== Number(ide)
            }) 
            localStorage.setItem('carrito',JSON.stringify(productosDelCarrito))
            pintarProductosEnCarrito(productosDelCarrito)
            pintarTotal(productosDelCarrito)
           
        } 
        
        else if(e.target.classList.contains('cartPlus')){
             
            let productosDelCarrito = JSON.parse(localStorage.getItem('carrito')) || []
            const ide= e.target.parentElement.parentElement.parentElement.id
            const productoAumentar = productosDelCarrito.find((element)=>{
                       return element.id === Number(ide)
            })

              if(productoAumentar.cantidad !== productoAumentar.quantity){
                productoAumentar.cantidad+=1
               
              
               
              localStorage.setItem('carrito',JSON.stringify(productosDelCarrito))
              pintarProductosEnCarrito(productosDelCarrito)
              pintarTotal(productosDelCarrito)
              } else{
                alert('no hay mas')
              }

            
             



        } else if(e.target.classList.contains('cartMinus')){
            

            let productosDelCarrito = JSON.parse(localStorage.getItem('carrito')) || []
            const ide= e.target.parentElement.parentElement.parentElement.id
            const productoAumentar = productosDelCarrito.find((element)=>{
                       return element.id === Number(ide)
            })
            if(productoAumentar.cantidad !== 1){
                productoAumentar.cantidad-=1
                
              localStorage.setItem('carrito',JSON.stringify(productosDelCarrito))
              pintarProductosEnCarrito(productosDelCarrito )
              pintarTotal(productosDelCarrito)
              } 



            }  
      })
}
function pintarTotal(productosDelCarrito){
    let total = 0
       productosDelCarrito.forEach((element)=>{
              total += (element.precio*element.cantidad)
             total = Math.floor(total)
       })

    document.getElementById('totalCarrito').innerHTML = `
    <div class="contenedorTotal">
          <div class="unidadesComprar">${productosDelCarrito.length}productos</div>
           <div class="unidadesTotal"> total: ${total}.00</div>
      </div>
      
    
    `
}
function comprar(){
    const btnComprar = document.querySelector('#btnDeCompra')
      btnComprar.addEventListener('click',()=>{
       let res = JSON.parse(localStorage.getItem('productos')) || traerDatos()
       let productosDelCarrito = JSON.parse(localStorage.getItem('carrito')) || []
          

       
       console.log(res)  
       console.log(productosDelCarrito)
             
       if(!productosDelCarrito.length) {
           alert('no hay nada para comprar')
           return 
       }
       
       console.log(res)  
       console.log(productosDelCarrito)
       const comprar = confirm('vas a comprar')
          if(!comprar) return
          
             


         productosDelCarrito.forEach((element)=>{
                       const ideDelProductoParaComprar =  element.id
                       const elementoAComprar = element
                       res.forEach((element)=>{
                             if(element.id === ideDelProductoParaComprar){
                                element.quantity = element.quantity - elementoAComprar.cantidad
                            }
                        })
                    })   
                    localStorage.setItem('productos',JSON.stringify(res))
                    localStorage.setItem('carrito',JSON.stringify([]))     
                    productosDelCarrito = []
                    
                    
                    console.log(res)  
                    console.log(productosDelCarrito)  
                    pintarProductos(res)
                    pintarProductosEnCarrito(productosDelCarrito)
                    pintarTotal(productosDelCarrito)
                    agregaProductosAlCarrito(res,productosDelCarrito)
                    modalDelProducto (res )   
                    
                })
                
}
function modalDelProducto (res ){
    
    let imagenesParaAbrirModal = document.querySelectorAll('.imgSelect')
      let cartaDelModal = document.querySelector('.contentModalInfo')
      let contenedorDelModal = document.querySelector('.modalProductSelectedInfo')
      
      imagenesParaAbrirModal.forEach((element)=>{
              element.addEventListener('click', ()=>{
                
                const ultimoIndice = element.src.lastIndexOf('/');
                const penultimoIndice = element.src.lastIndexOf('/', ultimoIndice - 1);
                let imgParaBuscarProducto = element.src.slice(penultimoIndice)


                let productoEncontrado = res.find((element)=>{
                     return element.imagen === imgParaBuscarProducto
                })


                     console.log(productoEncontrado);
                contenedorDelModal.style.visibility = 'visible'
                contenedorDelModal.style.opacity = '1'
                 cartaDelModal.innerHTML = `
                 <div class="btnCerrarModal">X</div>
                 <div class="img__modal">
                   <img src="${productoEncontrado.imagen}" alt="">
                 </div>
                 <div class="modal__info">
                    <h2 class="modal__tittle">${productoEncontrado.nombre}</h2>
                    <p class="modal__description">${productoEncontrado.descripcion}</p>
                    <div class="modal__total">
                          <div class="modal__price">$15.00</div>
                          
                          ${productoEncontrado.quantity ? `<div class="modal__stock">STOCK:${productoEncontrado.quantity}</div>` : `<div class = "product__soldOut modalSold">SOLD OUT</div>` }
                    </div>
                 </div>

                 `
                   

                 let botonDeCerrarModal = document.querySelector('.btnCerrarModal')
                 botonDeCerrarModal.addEventListener('click',()=>{
                    
                    contenedorDelModal.style.visibility = 'hidden'
                    contenedorDelModal.style.opacity = '0'
                 })
              })

      })
}


function main() {
    let res = JSON.parse(localStorage.getItem('productos')) || traerDatos()
    let productosDelCarrito = JSON.parse(localStorage.getItem('carrito')) || []
    pintarProductos(res)
    pintarTotal(productosDelCarrito)
    funcionalidadCartProduct(res,productosDelCarrito)
      pintarProductosEnCarrito(productosDelCarrito)
      agregaProductosAlCarrito(res,productosDelCarrito)
      cerrarCarrito()
      mostrarCarrito()
      comprar()
       modalDelProducto(res)
      
     document.querySelector('.bxs-layout').addEventListener('click',()=>{
        document.querySelector('.mobileBtns').classList.add('mostrarMobileBtns')
     })
     document.querySelector('.cerrarMobileBtn').addEventListener('click',()=>{
        document.querySelector('.mobileBtns').classList.remove('mostrarMobileBtns')
     })
     document.querySelector('.HyP').addEventListener('click',(e)=>{
      
        if(e.target.tagName === "A"){
            document.querySelector('.mobileBtns').classList.remove('mostrarMobileBtns')

        }
     })
     
       



    
   
   
}








main()








