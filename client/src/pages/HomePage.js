import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth.js'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import toast from 'react-hot-toast';
import { Prices } from '../components/Prices.js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart.js';
import '../styles/Homepage.css'

const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);



    //get all cat
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data.success) {
                setCategories(data.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something wwent wrong in getting catgeory");
        }
    };



    //getTotal Count
    const getTotal = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/product-count')
            setTotal(data?.total)
        }
        catch (error) {
            console.log(error);
        }
    }


    //get products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        }
        catch (error) {
            setLoading(false);
            console.log(error)
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    useEffect(() => {
        if (page === 1) return
        loadMore()
    }, [page]);

    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`)
            setLoading(false);
            setProducts([...products, ...data?.products])

        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    //filter by cat
    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id);
        }
        else {
            all = all.filter(c => c !== id)
        }
        setChecked(all);
    }

    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();

    }, [checked.length, radio.length]);


    useEffect(() => {
        if (checked.length || radio.length)
            filterProduct();
    }, [checked, radio]);
    //get filterd product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post('/api/v1/product//product-filters', { checked, radio })
            setProducts(data?.products)
        }
        catch (error) {

        }
    }

    return (
        <Layout title={"Shop Now- Best Offers"}>
            <div className='row'>
                <div className='col-md-3'>
                    <h4 className='text-center'>Filter By Category</h4>
                    <div className='d-flex flex-column' >
                        {categories?.map((c) => (
                            <Checkbox key={c._id} onChange={(e) =>
                                handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    {/* price filter*/}
                    <h4 className='text-center'>Filter By Price</h4>
                    <div className='d-flex flex-column'>
                        <Radio.Group
                            onChange={e => setRadio(e.target.value)}>

                            {Prices?.map((p) => (
                                <Radio key={p.name} value={p.array}>
                                    {p.name}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className='d-flex flex-column'>
                        <button className='btn btn-danger'
                            onClick={() => window.location.reload()}>
                            RESET FILTERS
                        </button>
                    </div>
                </div>
                <div className='col-md-9'>

                    <h1 className='text-center'>All Products</h1>
                    <div className='d-flex flex-wrap'>
                        {products?.map((p) => (

                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 100)}</p>
                                    <p className="card-text"> $ {p.price}</p>
                                    <button
                                        className='btn btn-primary ms-2'
                                        onClick={() => navigate(`/product/${p.slug}`)}>
                                        See Details
                                    </button>
                                    <button
                                        className='btn btn-secondary ms-2'
                                        onClick={() => {
                                            setCart([...cart, p]);
                                            localStorage.setItem(
                                                'cart',
                                                JSON.stringify([...cart, p])
                                            );
                                            toast.success('Item added to Cart');
                                        }}
                                    >
                                        ADD TO CART
                                    </button>

                                </div>
                            </div>

                        ))}
                    </div>
                    <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button className='btn btn-warning'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}>
                                {loading ? 'loading ... ' : 'Loadmore'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage;