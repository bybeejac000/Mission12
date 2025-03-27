import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { cart } from './types/cart';
import { useState } from 'react';

function Cart() {
  const navigate = useNavigate();
  const { cart } = useCart();
  console.log(cart);
  return (
    <>
      <h1>Your Cart</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Book</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((c) => (
            <tr>
              <td>{c.title}</td>
              <td>{c.origPrice}</td>
              <td>{Math.round(c.price / c.origPrice)}</td>
              <td>{c.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total: {cart.reduce((total, c) => total + c.price, 0)}</p>
    </>
  );
}

export default Cart;
