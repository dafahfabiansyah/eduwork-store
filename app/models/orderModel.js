import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
      default: 'waiting_payment',
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      province: { type: String, required: true },
      regency: { type: String, required: true },
      district: { type: String, required: true },
      sub_district: { type: String, required: true },
      detail: { type: String },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    order_item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
    },
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });
orderSchema.virtual('items_count').get(function () {
  return this.order_item.reduce((total, item) => (total += item.price * item.quantity), 0);
});
orderSchema.post('save', async function () {
  let sub_total = this.order_item.reduce((total, item) => (total += parseInt(item.quantity)));
  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    delivery_address: this.delivery_address,
    total: parseInt(this.delivery_fee + sub_total),
  });
  await invoice.save();
});
export const Order = mongoose.model('Order', orderSchema);
