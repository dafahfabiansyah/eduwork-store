import express from 'express';
import { Address } from '../models/addressModel.js';
import { policyCheck } from '../utils/token/decodeToken.js';

const router = express.Router();
// policyCheck('create', 'DeliveryAddress'),
// create
router.post('/', async (req, res) => {
  try {
    const newAddress = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      postal_code: req.body.postal_code,
      detail: req.body.detail,
    };

    // Menyimpan alamat baru ke basis data
    const address = await Address.create(newAddress);

    // Mengirimkan respons dengan status 201 (Created)
    return res.status(201).send(address);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// read
// Mendapatkan semua alamat
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.find();
    return res.status(200).send(addresses);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// read by ID
// policyCheck('read', 'DeliveryAddress'),
router.get('/:id', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).send({ message: 'Alamat tidak ditemukan' });
    }
    return res.status(200).send(address);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// update
// policyCheck('update', 'DeliveryAddress'),
router.put('/:id', async (req, res) => {
  try {
    const updatedAddress = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      postal_code: req.body.postal_code,
      detail: req.body.detail,
    };

    const address = await Address.findByIdAndUpdate(req.params.id, updatedAddress, { new: true });

    if (!address) {
      return res.status(404).send({ message: 'Alamat tidak ditemukan' });
    }

    return res.status(200).send(address);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// delete
//  policyCheck('delete', 'DeliveryAddress')
router.delete('/:id', async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);

    if (!address) {
      return res.status(404).send({ message: 'Alamat tidak ditemukan' });
    }

    return res.status(204).send(); // Mengirim respons tanpa isi (No Content)
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
