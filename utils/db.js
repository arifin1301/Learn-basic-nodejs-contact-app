const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/dion');



//menambah 1 data
// const contact1 = new Contact({
//     nama: 'Dion',
//     nohp: '0812567892566',s
//     alamat: 'Embung raja'
// })

// //simpan kontak
// contact1.save().then((contact) => console.log(contact))