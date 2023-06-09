"use client";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

interface Product {
  uuid: string;
  deleted: boolean;
  createdAt: Date;
  title: string;
  url: string;
}

interface Wishlist {
  uuid: string;
  title: string;
  deleted: boolean;
  createdAt: Date;
  products: Product[];
}

const WishlistForm = () => {
  const [user, setUser] = useState<string>("");
  const [products, setProducts] = useState<{ title: string; url: string }[]>(
    []
  );
  const [title, setTitle] = useState<string>("");
  const [wishLists, setWishlists] = useState<Wishlist[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedProducts = [...products];
    updatedProducts[index].title = e.target.value;
    setProducts(updatedProducts);
  };

  const handleProductURLChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedProducts = [...products];
    updatedProducts[index].url = e.target.value;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { title: "", url: "" }]);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const notifySuccess = () => {
    toast.success("Wishlist criada com sucesso!");
  };

  const notifyError = () => {
    toast.error("Ocorreu um erro ao criar a wishlist.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const wishlist: Wishlist = {
      uuid: uuidv4(),
      title: title,
      deleted: false,
      createdAt: new Date(),
      products: products
        .filter((product) => product.title.trim() !== "")
        .map((product) => ({
          uuid: uuidv4(),
          deleted: false,
          createdAt: new Date(),
          title: product.title,
          url: product.url,
        })),
    };

    const response: AxiosResponse<Wishlist> = await axios.post(
      "http://localhost:8080/wishlists",
      wishlist
    );
    if (response.status === 201) {
      notifySuccess();
      const updatedWishlist: Wishlist = {
        ...response.data,
        products: response.data.products.map((product, index) => ({
          ...product,
          url: `https://localhost:8080/wishlists/products/${index}`,
        })),
      };
      setWishlists((prevWishlists) => [...prevWishlists, updatedWishlist]);
      console.log(updatedWishlist);
      setProducts([]);
    } else {
      notifyError();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-2">
            Título da Wishlist:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border rounded-md text-black"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="block font-medium mb-2">Produtos:</label>
          {products.map((product, index) => (
            <div key={index} className="flex mb-2">
              <div className="flex flex-row items-center ">
                <label className="block font-medium mr-2 mb-2">Título</label>
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) => handleProductChange(e, index)}
                  className="w-full px-3 py-2 border rounded-md mr-2 text-black"
                />
                <div className="flex flex-row items-center">
                  <label className="block font-medium mr-2 mb-2">Link:</label>
                  <input
                    type="text"
                    value={product.url}
                    onChange={(e) => handleProductURLChange(e, index)}
                    className="w-full px-3 py-2 border rounded-md mr-2 text-black"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="px-3 py-2 border rounded-md bg-red-500 text-white"
              >
                Remover
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddProduct}
            className="px-3 py-2 border rounded-md bg-green-500 text-white"
          >
            Adicionar Produto
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Criar Wishlist
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default WishlistForm;
