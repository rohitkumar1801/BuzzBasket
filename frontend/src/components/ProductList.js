import { useEffect, useState } from "react"

const ProductList = () => {

    const fakeproducts = []

    const [products, setProducts] = useState(fakeproducts);

    const getProducts = async() => {
        const res = await fetch('http://localhost:8080/products');
        const data = await res.json();
        console.log(data.products);
        setProducts(data.products);
    }

    useEffect(()=>{
        getProducts();
    }, []);

  return (
    <div className="bg-gray-200">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        
        <h2 className="text-4xl font-bold mb-4 text-center">All Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a key={product._id} href={product?.href} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  alt={"Image loading..."}
                  src={product.thumbnail}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-lg text-gray-700 font-semibold text-left ">{product.title}</h3>
              <p className="mt-1 text-md font-medium text-gray-900">$ {product.price}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductList