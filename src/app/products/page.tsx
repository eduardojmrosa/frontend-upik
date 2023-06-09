import ProductsForm from "../../components/ProductsForm";
const page = () => {
  return (
    <div className="bg-black flex flex-col items-center justify-start m-0 w-screen h-screen">
      <h1 className="text-white text-xl mt-4 mb-4">Cadastro de Produtos</h1>
      <ProductsForm />
    </div>
  );
};

export default page;
