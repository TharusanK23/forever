import { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { baseApiUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({token}) => {

    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setsubCategory] = useState("Topwear");
    const [bestseller, setBestSeller] = useState(false);
    const [sizes, setSizes] = useState([]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));

            image1 && formData.append("image1", image1);
            image2 && formData.append("image2", image2);
            image3 && formData.append("image3", image3);
            image4 && formData.append("image4", image4);

            const res = await axios.post(baseApiUrl + "/api/product/add", formData, {headers: {Authorization : token}});
            
            if(res.data.success) {
                toast.success(res.data.message);
                setName("");
                setDescription("");
                setPrice("");
                setCategory("Men");
                setsubCategory("Topwear");
                setBestSeller(false);
                setSizes([]);
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
            } else {
                toast.error(res.data.message);
            }
            
        } catch (error) {
            if(error.status == 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 mb-3'>
        <div>
            <p className='mb-2'>Upload Image</p>

            <div className='flex gap-2'>
                <label htmlFor="image1">
                    <img className='w-20 cursor-pointer' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                    <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden/>
                </label>
                <label htmlFor="image2">
                    <img className='w-20 cursor-pointer' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                    <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden/>
                </label>
                <label htmlFor="image3">
                    <img className='w-20 cursor-pointer' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                    <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden/>
                </label>
                <label htmlFor="image4">
                    <img className='w-20 cursor-pointer' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                    <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden/>
                </label>
            </div>
        </div>

        <div className='w-full mb-3'>
            <p className='mb-2'>Product name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Type here' className='w-full max-w-[500px] px-3 py-2' required />
        </div>
        <div className='w-full mb-3'>
            <p className='mb-2'>Product description</p>
            <textarea onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder='Write content here' className='w-full max-w-[500px] px-3 py-2' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mb-3'>
            <div>
                <p className='mb-2'>Product Category</p>
                <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                </select>
            </div>
            <div>
                <p className='mb-2'>Sub category</p>
                <select onChange={(e) => setsubCategory(e.target.value)} className='w-full px-3 py-2'>
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                </select>
            </div>
            <div>
                <p>Product Price</p>
                <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder='1750' className='w-full sm:w-[120px] px-3 py-2' required />
            </div>
        </div>

        <div className='mb-3'>
            <p className='mb-2'>Product Sizes</p>
            <div className='flex gap-3'>
                <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
                    <p className={`${sizes.includes("S") ? 'bg-pink-100 border-pink-300' : 'bg-slate-200 border-slate-200'} px-3 py-1 cursor-pointer border`}>S</p>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
                    <p className={`${sizes.includes("M") ? 'bg-pink-100 border-pink-300' : 'bg-slate-200 border-slate-200'} px-3 py-1 cursor-pointer border`}>M</p>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
                    <p className={`${sizes.includes("L") ? 'bg-pink-100 border-pink-300' : 'bg-slate-200 border-slate-200'} px-3 py-1 cursor-pointer border`}>L</p>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
                    <p className={`${sizes.includes("XL") ? 'bg-pink-100 border-pink-300' : 'bg-slate-200 border-slate-200'} px-3 py-1 cursor-pointer border`}>XL</p>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
                    <p className={`${sizes.includes("XXL") ? 'bg-pink-100 border-pink-300' : 'bg-slate-200 border-slate-200'} px-3 py-1 cursor-pointer border`}>XXL</p>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("XXXL") ? prev.filter(item => item !== "XXXL") : [...prev, "XXXL"])}>
                    <p className={`${sizes.includes("XXXL") ? 'bg-pink-100 border-pink-300' : 'bg-slate-200 border-slate-200'} px-3 py-1 cursor-pointer border`}>XXXL</p>
                </div>
            </div>
        </div>
        
        <div className='flex gap-2 mt-2'>
            <input onChange={() => setBestSeller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
            <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>Add</button>
    </form>
  )
}

export default Add