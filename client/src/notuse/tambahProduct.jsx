import { addProduct } from "../services/productServices";
import { useState } from "react";
import Header from "../components/header";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Form from "../components/form";


export default function TambahProduct(){
    const navigate = useNavigate();
    const { id } = useParams();
    const umkm_id = id ;

    const [formData, setFormData] = useState({
        umkm_id: umkm_id,
        name: '',
        category: '',
        base_price: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        if(fieldErrors[e.target.id]){
            setFieldErrors({
                ...fieldErrors,
                [e.target.id]: null,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});
        try{
            const payload = {
                ...formData,
                umkm_id,
                base_price: formData.base_price === '' ? '' : Number(formData.base_price),
            };
            await addProduct(payload);
            alert('Produk berhasil ditambahkan');
            navigate(`/product/${umkm_id}`);
        }catch(err){
            if(err.errors){
                setFieldErrors(err.errors);
            } else {
                setError(err.message || 'Gagal Menghubungi server');
            }
        }finally{
            setLoading(false);
        }
    }

    const productFields = [
        { id: 'name', label: 'Nama Produk', type: 'text', placeholder: 'Masukkan nama produk', autoComplete: 'nope' },
        { id: 'category', label: 'Kategori', type: 'select', options: [
            { value: '', label: 'Pilih kategori' },
            { value: 'Teknologi', label: 'Teknologi' },
            { value: 'Pertanian', label: 'Pertanian' },
            { value: 'Minuman', label: 'Minuman' },
            { value: 'Makanan', label: 'Makanan' },
            { value: 'Elektronik', label: 'Elektronik' },
            { value: 'Kerajinan', label: 'Kerajinan' },
            { value: 'Kesehatan', label: 'Kesehatan' },
            { value: 'Pakaian', label: 'Pakaian' },
            { value: 'Kecantikan', label: 'Kecantikan' },

            { value: 'Logistik', label: 'Logistik' },
            { value: 'Servis Kendaraan', label: 'Servis Kendaraan' },
            { value: 'Event Organizer', label: 'Event Organizer' },
            { value: 'Alat Kesehatan', label: 'Alat Kesehatan' },
            { value: 'Suplemen', label: 'Suplemen' },
            { value: 'Obat Herbal', label: 'Obat Herbal' },
            { value: 'Pakaian Pria', label: 'Pakaian Pria' },
            { value: 'Desain', label: 'Desain' },
            { value: 'Perawatan', label: 'Perawatan' },
            { value: 'Jasa Medis', label: 'Jasa Medis' },
            { value: 'Interior', label: 'Interior' },
            { value: 'Kursus Offline', label: 'Kursus Offline' },
            { value: 'Buku', label: 'Buku' },
            { value: 'Kursus Online', label: 'Kursus Online' },
            { value: 'Dessert', label: 'Dessert' },
            { value: 'Makanan Berat', label: 'Makanan Berat' },
            { value: 'Bibit', label: 'Bibit' },
            { value: 'Alat Tani', label: 'Alat Tani' },
            { value: 'Produk Olahan', label: 'Produk Olahan' },
            { value: 'Bimbel', label: 'Bimbel' },
            { value: 'Pelatihan', label: 'Pelatihan' },
            { value: 'IoT', label: 'IoT' },
            { value: 'Software', label: 'Software' },
            { value: 'Jasa IT', label: 'Jasa IT' },
            { value: 'Servis', label: 'Servis' }
        ],
        autoComplete: 'nope'
    },
        { id: 'base_price', label: 'Harga Dasar', type: 'number', placeholder: 'Masukkan harga dasar produk', autoComplete: 'nope' },
    ];

    return(
        <>
            <main>
                <Header />
                <Form 
                    title="Tambah Produk UMKM"
                    fields={productFields}
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    fieldErrors={fieldErrors}
                    buttonText="Tambah Produk"
                />
                
            </main>
        </>
    )

}