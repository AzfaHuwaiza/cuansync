import { addUMKM } from "../services/umkmService";
import { useState } from "react";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import Form from "../components/form";



export default function TambahUMKM(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        sector: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        if(e.target.id === 'photo' || e.target.type === 'file'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.files[0],
            });
        }else{
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
        if(fieldErrors[e.target.id]){
            setFieldErrors({
                ...fieldErrors,
                [e.target.id]: null,
            });
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});
        try{
            const formBox = new FormData();
            formBox.append('name', formData.name);
            formBox.append('sector', formData.sector);
            formBox.append('description', formData.description);
            if(formData.photo){
                formBox.append('photo', formData.photo);
            }

            const response = await addUMKM(formBox);
            alert(response.message);
            navigate('/umkm');
        } catch (error) {
            if(error.errors){
                setFieldErrors(error.errors );
            } else {
                setError(error.message || 'Gagal Menghubungi server');
            }
        } finally {
            setLoading(false);
        }
    }

    const umkmFields = [ 
        { id: 'name', label: 'Nama UMKM', type: 'text', placeholder: 'Masukkan nama UMKM', autoComplete: 'nope' },
        { id: 'sector', label: 'Sektor UMKM', type: 'select', options: [
            { value: '', label: 'Pilih Sektor UMKM'},
            { value: 'Kerajinan', label: 'Kerajinan'},
            { value: 'Transportasi' , label: 'Transportasi'},
            { value: 'Pendidikan' , label: 'Pendidikan'},
            { value: 'Pertanian' , label: 'Pertanian'},
            { value: 'Fashion' , label: 'Fashion'},
            { value: 'Kuliner' , label: 'Kuliner'},
            { value: 'Teknologi' , label: 'Teknologi'},
            { value: 'Kesehatan' , label: 'Kesehatan'},
            { value: 'Jasa' , label: 'Jasa'},
            { value: 'Properti' , label: 'Properti'},
        ], autoComplete: 'nope' },
        { id: 'description', label: 'Deskripsi UMKM', type: 'textarea', placeholder: 'Masukkan deskripsi singkat tentang UMKM Anda', autoComplete: 'nope' },
        { id: 'photo', label: 'Foto UMKM', type: 'file', placeholder: 'Masukkan foto UMKM', autoComplete: 'nope', accept: 'image/*', required: false },
    ];

    return(
        <>
            <main>
                <Header />
                <Form 
                    title="Tambah UMKM Baru"
                    fields={umkmFields}
                    formData={formData}
                    buttonText="Simpan UMKM"
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    fieldError={fieldErrors}
                />
            </main>
        </>
    )

}