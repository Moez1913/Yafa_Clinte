import React from 'react'
import UseOrders from '../../../Hooks/useAdmin/UseOrders';
import UseAxiosSecure from '../../../Hooks/Axios/UseAxiosSecure';
import Swal from 'sweetalert2';

const Completed = () =>{
  const [orders, refetch] = UseOrders('delivered');
    const axiosSecure = UseAxiosSecure();
    const handleConfirm = (orderId) => {
      axiosSecure
      .delete(`/order/${orderId}`)
      .then((res) => {
        if (res.data.deletedCount > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Order deleted successfully'
          });
        }
        refetch();
      });
    }
  return (
    <div className='w-full flex flex-col gap-2'>
        {
            orders.map(order =><div key={order._id}  >
  


<div className="card p-4 flex justify-between w-full bg-base-200 card-md shadow-lg border border-base-300">
  
  <div>
    <h1 className="text-lg font-bold">Customer Information:</h1>
  <div className='flex justify-between items-center'>
  <p className="text-base font-normal">Name: {order.name}</p>
    <p>Email: {order.email}</p>
    <p>Phone: {order.phone}</p>
 </div>
    <div className="divider"></div>
    <h1 className="text-lg font-bold">Order ID: {order._id}</h1>
    <h1 className="text-lg font-bold">Order Details:</h1>
    <div className='flex'>
      
      <div>
         {
        order.items.map((item,index)=><div key={index}>
          <div className="flex  gap-4">
             <p>{item.productName} - {item.quantity}--{item.price}</p>
             
          </div>
     

         

        </div>)}

      </div>
            <div className="divider lg:divider-horizontal"></div>
      <div>
          <p>TotalItems:{order.totalQuantity}</p>
          <p>Prtoduct Price: {order.totalProductPrice}</p>
          <p>Discount: {order.discount}</p>
          <p>DeliveryCharge: {order.deliveryCharge}</p>
         
          <p>Total: {order.total}</p>
         </div>
          <div className="divider lg:divider-horizontal"></div>
         <div>
    <p>Name:{order.name}</p>
    <p>Phone:{order.phone}</p>
    <p className='text-wrap'>Address: {order.address}</p>
    <p> <span className='text-base font-normal text-indigo-500'> Note:</span>  {order.note}</p>
    
  </div>
    </div>
  </div>
    <div className="divider"></div>

  <div className='flex gap-2 justify-end'>
    <button onClick={() => handleConfirm(order._id, "delivered")} className='btn btn-error text-error'>Delete</button>
   
  </div>
</div>




            </div> )
        }
    </div>
  )
}

export default Completed