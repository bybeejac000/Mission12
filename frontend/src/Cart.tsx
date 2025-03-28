import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { cart } from './types/cart';
import { useState } from 'react';

function Cart() {
  //define navigation adn cart
  const navigate = useNavigate();
  const { cart } = useCart();

  return (
    <>
      <h1>Your Cart</h1>
      <button onClick={() => navigate(-1)}>Continue Shopping</button>
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
          {/*Go through the carta nd display data */}
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
      <p>
        Total:{' '}
        {Math.round(cart.reduce((total, c) => total + c.price, 0) * 100) / 100}
      </p>
    </>
  );
}

export default Cart;
