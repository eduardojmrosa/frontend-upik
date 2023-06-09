const ProductsForm = () => {
  return (
    <form className="border-solid border-2 border-white w-96 p-8 rounded-xl">
      <div className="space-y-12 flex flex-col items-center gap-0 justify-center">
        <div className="border-b flex flex-col items-center border-gray-900/10 pb-12">
          <label>Nome do Produto</label>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            className="block flex-1 border-0 rounded-md bg-white py-1.5 pl-1 text-gray-900 text-center placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Um produto bacana"
          />
        </div>
        <div className="border-b flex flex-col items-center border-gray-900/10 pb-12">
          <label>URL do Produto</label>
          <input
            type="text"
            name="url"
            id="productUrl  "
            autoComplete="url"
            className="block flex-1 border-0 rounded-md bg-white py-1.5 pl-1 text-center text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="https://stam.com/maçanetas"
          />
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-4">
          <button
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductsForm;
