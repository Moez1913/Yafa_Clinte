import React from "react";
import UseAxiosSecure from "../../../Hooks/Axios/UseAxiosSecure";
import UseOrders from "../../../Hooks/useAdmin/UseOrders";

const PendingOrders = () => {
  const [orders, refetch] = UseOrders("pending");
  const axiosSecure = UseAxiosSecure();

  const handleConfirm = (orderId,status) => {
    axiosSecure
      .patch(`/order/${orderId}`, {status})
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          alert(`Order ${status} successfully`);
        }
        refetch();
      });
  };

  return (
    <div>
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-base-100 border-base-300 collapse border"
        >
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-xl font-medium bg-purple-400 text-white  peer-checked:bg-purple-500 peer-checked:text-white">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
              <table className="table bg-purple-400">
                <tbody>
                  <tr>
                    <th>{order.name}</th>
                    <td>
                      <li>{order.phone}</li>
                    </td>
                    <td>
                      {new Date(order.orderDate).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="collapse-content bg-white text-black  ">
            {order.items.map((item) => (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </td>
                      <td>
                        <h3 className="font-semibold">{item.productName}</h3>
                      </td>
                      <td>৳ {item.price}</td>

                      <td>{item.brand}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            <div key={order._id}  >
  


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
    <button onClick={() => handleConfirm(order._id ,"confirmed")} className='btn btn-success text-success'>Confirm</button>
    <button onClick={() => handleConfirm(order._id,"cancelled")} className='btn btn-error text-red-600'>Cancel</button>
  </div>
</div>




            </div> 
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingOrders;
