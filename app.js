const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')
require('./utils/db')
const Contact = require('./model/contact')

// flash
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//setting flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.listen(port, () => {
    console.log(`mongo contact app listen in port ${port}`)

})

// menu utama
app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: "Dion",
            alamat: 'embung raja',
            umur: 20
        },
        {
            nama: "dina",
            alamat: 'jengggik',
            umur: 17
        },
    ]

    res.render('index', {
        layout: 'layout/main-layout',
        nama: 'Dion',
        judul: 'Halaman Utama',
        mahasiswa
    })
})

//menu about
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layout/main-layout',
        judul: 'Halaman About'
    })
})

// halaman contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()
    res.render('contact', {
        layout: 'layout/main-layout',
        judul: 'Halaman Contact',
        contacts,
        msg: req.flash('msg')
    })
})

//halaman tambah data
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        judul: 'tambah kontak',
        layout: 'layout/main-layout'
    })
})

//tambah data post
app.post('/contact', [
    body('nama').custom(async value => {
        const duplikat = await Contact.findOne({ nama: value })
        if (duplikat) {
            throw new Error("nama kontak sudah digunakan")
        }
        return true
    }),
    check('nohp', 'nomer HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            judul: "tambah kontak",
            layout: "layout/main-layout",
            errors: errors.array()
        })
    } else {
        Contact.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Data Berhasil Ditambahkan')
            res.redirect('/contact')
        })
    }
})

//pindah ke halaman edit data
app.get('/contact/edit/:nama', async (req, res) => {
    const nama = req.params.nama
    const contact = await Contact.findOne({ nama: nama })
    res.render('edit-contact', {
        layout: 'layout/main-layout',
        judul: 'edit kontak',
        contact
    })
})

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash('msg', 'Data Berhasil dihapus')
        res.redirect('/contact')
    })
})

//halaman update data
app.put('/contact', [
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value })
        if (value !== req.body.oldNama && duplikat) {
            throw new Error("nama kontak sudah digunakan")
        }
        return true
    }),
    check('nohp', 'nomer HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            judul: "Ubah kontak",
            layout: "layout/main-layout",
            errors: errors.array(),
            contact: req.body
        })
    } else {
        // res.send(req.body)
        Contact.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    nama: req.body.nama,
                    nohp: req.body.nohp,
                    alamat: req.body.alamat
                }
            }).then(() => {
                req.flash('msg', 'Data Berhasil diubah')
                res.redirect('/contact')
            })
    }
})

//halaman detail contact
app.get('/contact/:nama', async (req, res) => {
    const nama = req.params.nama
    const contact = await Contact.findOne({ nama: nama })
    res.render('detail', {
        layout: 'layout/main-layout',
        judul: 'Halaman Contact',
        contact
    })
})



//opsi terakhir
app.use('/', (req, res) => {
    res.status("404")
    res.send("<h1>Page Not Found</h1>")
})