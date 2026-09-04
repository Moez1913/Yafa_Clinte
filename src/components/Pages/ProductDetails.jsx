import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShopContext } from "../../providers/ShopProvider";

const ProductDetails = () => {
  const product = useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const {addToCart}=useContext(ShopContext)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left Side */}
        <div className="border rounded-xl p-5 bg-white">

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[450px] object-contain"
          />

        </div>

        {/* Right Side */}

        <div>

          <h1 className="text-3xl font-bold text-pink-600">
            {product.productName}
          </h1>

          <div className="divider my-4"></div>

          <div className="space-y-3">

            <p>
              <span className="font-semibold">Product Code :</span>{" "}
              {product.code}
            </p>

            <p>
              <span className="font-semibold">Brand :</span>{" "}
              {product.brand}
            </p>

            <p>
              <span className="font-semibold">Origin :</span>{" "}
              {product.origin}
            </p>

            <p>
              <span className="font-semibold">Category :</span>{" "}
              {product.category}
            </p>

            <p>
              <span className="font-semibold">Size :</span>{" "}
              {product.size}
            </p>

            <p>
              <span className="font-semibold">Stock :</span>

              <span className="text-green-600 ml-2 font-semibold">
                In Stock
              </span>

            </p>

          </div>

          {/* Price */}

          <div className="flex items-center gap-4 mt-8">

            <h2 className="text-4xl font-bold text-pink-600">
              ৳ {product.price}
            </h2>

            {product.oldPrice && (
              <del className="text-xl text-gray-400">
                ৳ {product.oldPrice}
              </del>
            )}

          </div>

          {/* Quantity */}

          <div className="flex items-center gap-5 mt-8">

            <span className="font-semibold">
              Quantity
            </span>

            <div className="flex border rounded-lg">

              <button
                onClick={() =>
                  quantity > 1 && setQuantity(quantity - 1)
                }
                className="px-4 py-3 hover:bg-gray-100"
              >
                <FaMinus />
              </button>

              <span className="px-6 flex items-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 hover:bg-gray-100"
              >
                <FaPlus />
              </button>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-4 mt-10">

            <Link to={`/BuyNow/${product._id}`} className="btn btn-primary flex-1">
              BUY NOW
            </Link>

            <button
              onClick={() => addToCart(product)}
              className="btn btn-secondary flex-1"
            >
              ADD TO CART
            </button>

          </div>

        </div>

      </div>

      {/* Description Section */}

    

      <div className="mt-12 rounded-3xl border border-base-300 bg-white shadow-sm">
        <div className="rounded-t-3xl bg-primary/10 px-6 py-5">
          <h2 className="text-2xl font-bold text-primary">Product Details</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Explore the full details of this item with a clean, easy-to-read layout.
          </p>
        </div>

        <div className="p-6">
          <div className="tabs tabs-boxed bg-purple-400 gap-3 text-white text-base font-medium rounded-2xl p-4 ">
            <button
              type="button"
              className={` tab tab-lg ${activeTab === "description" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              type="button"
              className={`tab tab-lg ${activeTab === "ingredients" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients
            </button>
            <button
              type="button"
              className={`tab tab-lg ${activeTab === "howToUse" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("howToUse")}
            >
              How to Use
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "description" ? (
              <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>
              </div>
            ) : activeTab === "ingredients" ? (
              <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                {product.ingredients ? (
                 <p>{product.ingredients}</p>
                ) : (
                  <p className="text-gray-700">
                    Ingredients are not specified for this product.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">How to Use</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.howToUse ||
                    "Use this product as directed by the manufacturer. Apply carefully and store in a cool, dry place."}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 text-gray-700">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Step 1</p>
                    <p className="mt-1 font-semibold">Prepare the product before use.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Step 2</p>
                    <p className="mt-1 font-semibold">Follow the instructions carefully.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Step 3</p>
                    <p className="mt-1 font-semibold">Use regularly for best results.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Step 4</p>
                    <p className="mt-1 font-semibold">Store safely after use.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      </div>


  );
};

export default ProductDetails;