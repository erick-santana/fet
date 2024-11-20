import { describe, it, expect, vi } from 'vitest';
import { createNewOrder, updateOrderStatus, removeOrder, listAllOrders, getOrder } from '../app/services/orderService';
import { orderRepository } from '../app/repository/orderRepository';

vi.mock('../app/repository/orderRepository');

describe('Order Service', () => {
  it('should create a new order', async () => {
    const userId = 'user123';
    const items = [{ productId: 'prod1', price: 100, quantity: 2 }];
    const shipping = 10;
    const savedOrder = { _id: 'order123', userId, items, subtotal: 200, shipping, total: 210, status: 'pending' };

    orderRepository.prototype.save = vi.fn().mockResolvedValue(savedOrder);

    const result = await createNewOrder(userId, items, shipping);

    expect(result).toEqual(savedOrder);
    expect(orderRepository.prototype.save).toHaveBeenCalled();
  });

  it('should update order status', async () => {
    const orderId = 'order123';
    const status = 'shipped';
    const updatedOrder = { _id: orderId, status };

    orderRepository.findByIdAndUpdate = vi.fn().mockResolvedValue(updatedOrder);

    const result = await updateOrderStatus(orderId, status);

    expect(result).toEqual(updatedOrder);
    expect(orderRepository.findByIdAndUpdate).toHaveBeenCalledWith(orderId, { status }, { new: true });
  });

  it('should remove an order', async () => {
    const orderId = 'order123';

    orderRepository.findByIdAndDelete = vi.fn().mockResolvedValue({ _id: orderId });

    const result = await removeOrder(orderId);

    expect(result).toEqual({ _id: orderId });
    expect(orderRepository.findByIdAndDelete).toHaveBeenCalledWith(orderId);
  });

  it('should list all orders', async () => {
    const orders = [{ _id: 'order123', items: [{ productId: 'prod1' }] }];

    orderRepository.find = vi.fn().mockReturnValue({
      populate: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(orders)
      })
    });

    const result = await listAllOrders();

    expect(result).toEqual(orders);
    expect(orderRepository.find).toHaveBeenCalled();
  });

  it('should get an order by ID', async () => {
    const orderId = 'order123';
    const order = { _id: orderId, items: [{ productId: 'prod1' }] };

    orderRepository.findById = vi.fn().mockReturnValue({
      populate: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(order)
      })
    });

    const result = await getOrder(orderId);

    expect(result).toEqual(order);
    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
  });
});