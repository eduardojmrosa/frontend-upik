"use client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";

interface Product {
  docId: any;
  uuid: string;
  deleted: boolean;
  createdAt: Date;
  title: string;
  url: string;
}

interface Wishlist {
  uuid: string;
  docId: string;
  title: string;
  deleted: boolean;
  createdAt: Date;
  products: Product[];
}

const WishLists = () => {
  const [wishLists, setWishLists] = useState<Wishlist[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedUrl, setEditedUrl] = useState<string>("");

  // API Call para pegar wishlists
  useEffect(() => {
    axios
      .get<Wishlist[]>("https://localhost:7017/app/wishlists")
      .then(function (response) {
        const filteredWishlists = response.data.filter(
          (wishlist) => !wishlist.deleted
        );

        const wishListsWithDocId: Wishlist[] = filteredWishlists.map(
          (wishlist) => ({
            ...wishlist,
            docId: wishlist.docId,
            products: wishlist.products.filter((product) => !product.deleted), // Armazena o ID do documento no objeto da wishlist
          })
        );

        setWishLists(wishListsWithDocId);
      });
  }, []);

  const WishlistComponent: React.FC<{ wishlist: Wishlist }> = ({
    wishlist,
  }) => {
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    const removeProduct = async (productUuid: string, docId: string) => {
      const response = await axios.patch(
        `http://localhost:8080/wishlist/${docId}/${productUuid}`
      );
      if (response.status === 201) {
        toast.success("Produto removido da lista de desejos");
        const updatedWishLists = wishLists.map((w) => {
          if (w.docId === docId) {
            // Usando o docId para encontrar a wishlist correta
            return {
              ...w,
              products: w.products.filter(
                (product) => product.uuid !== productUuid
              ),
            };
          }
          return w;
        });

        setWishLists(updatedWishLists);
      }
    };

    const removeWishlist = async (docId: string) => {
      const response = await axios.patch(
        `http://localhost:8080/wishlists/${docId}`
      );

      if (response.status === 201) {
        toast.success("Lista de desejos removida");
        const updatedWishLists = wishLists.filter(
          (wishlist) => wishlist.docId !== docId
        );
        setWishLists(updatedWishLists);
      } else {
        toast.error("Erro ao remover uma listage de desejos!");
      }
    };

    const openEditModal = (product: Product) => {
      const wishlist = wishLists.find((w) =>
        w.products.some((p) => p.uuid === product.uuid)
      );
      if (wishlist) {
        setEditedProduct(product);
        setEditedTitle(product.title);
        setEditedUrl(product.url);
        setModalOpen(true);
      }
    };

    const closeEditModal = () => {
      setModalOpen(false);
      setEditedProduct(null);
      setEditedTitle("");
      setEditedUrl("");
    };

    const updateProduct = () => {
      if (editedProduct) {
        const updatedWishLists = wishLists.map((wishlist) => {
          const updatedProducts = wishlist.products.map((product) => {
            if (product.uuid === editedProduct.uuid) {
              return {
                ...product,
                title: editedTitle,
                url: editedUrl,
              };
            }
            return product;
          });

          return {
            ...wishlist,
            products: updatedProducts,
          };
        });

        // Atualiza a lista de desejos no estado do componente
        setWishLists(updatedWishLists);

        // Envia a requisição PATCH para a API
        axios
          .patch(
            `http://localhost:8080/wishlist/${wishlist.docId}/update/${editedProduct}`,
            {
              title: editedTitle,
              url: editedUrl,
            }
          )
          .then((response) => {
            console.log(response.data); // Exibe a resposta da API no console
          })
          .catch((error) => {
            console.error(error); // Exibe o erro, se houver, no console
          });

        closeEditModal();
      }
    };

    const overlayClasses =
      "fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center";

    return (
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-4">
          Lista de Desejos: {wishlist.title}
        </h3>
        <List className="border border-gray-300 rounded-md">
          {wishlist.products.map((product) => (
            <ListItem
              key={product.uuid}
              className="border-b border-gray-300 p-4 flex items-center"
            >
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary={<h4 className="text-lg font-bold">{product.title}</h4>}
                secondary={
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {product.url}
                  </a>
                }
                className="flex flex-col items-start"
              />
              <div className="flex ml-auto">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeProduct(product.uuid, wishlist.docId)}
                >
                  <DeleteIcon className="text-red-500" />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => openEditModal(product)}
                >
                  <EditIcon className="text-blue-500" />
                </IconButton>
              </div>
            </ListItem>
          ))}
        </List>

        <div className="flex justify-end">
          <IconButton
            edge="end"
            aria-label="delete-wishlist"
            onClick={() => removeWishlist(wishlist.docId)}
          >
            <DeleteIcon className="text-red-500" />
          </IconButton>
        </div>

        <Modal
          isOpen={modalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Editar Produto"
          overlayClassName={overlayClasses}
          ariaHideApp={false}
          className="bg-black border-2 border-white w-96 h-96 mx-auto p-5 text-black rounded-md"
        >
          <h2 className="text-lg font-bold mb-4">Editar Produto</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-bold mb-2"
              >
                Título:
              </label>
              <input
                type="text"
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                onFocus={(e) => e.stopPropagation()} // Evita que o modal seja fechado quando o campo de texto receber foco
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="url"
                className="block text-gray-700 font-bold mb-2"
              >
                URL:
              </label>
              <input
                type="text"
                id="url"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                onFocus={(e) => e.stopPropagation()} // Evita que o modal seja fechado quando o campo de texto receber foco
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={updateProduct}
                className="px-4 py-2 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none"
              >
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  };

  return (
    <div>
      <ToastContainer />
      {wishLists.map((wishlist) => (
        <WishlistComponent key={wishlist.docId} wishlist={wishlist} />
      ))}
    </div>
  );
};

export default WishLists;
