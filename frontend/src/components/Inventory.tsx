import { useState, useEffect } from "react";
import {
  fetchItems,
  fetchCategories,
  fetchLocations,
  createItem,
  updateItem,
  deleteItem,
  type Item,
} from "../services/api";
import ItemModal from "./ItemModal";

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: "asc" | "desc";
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriesData, locationsData] = await Promise.all([
          fetchCategories(),
          fetchLocations(),
        ]);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (err) {
        setError("Failed to load filters");
        console.error(err);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const data = await fetchItems(
          searchTerm,
          selectedCategory,
          selectedLocation,
          sortConfig?.key,
          sortConfig?.direction
        );
        setItems(data);
        setError("");
      } catch (err) {
        setError("Failed to load inventory items");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, [searchTerm, selectedCategory, selectedLocation, sortConfig]);

  const handleSort = (key: keyof Item) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete item");
      console.error(err);
    }
  };

  const handleAddItem = async (item: Omit<Item, "id" | "status">) => {
    try {
      const { id } = await createItem(item);
      const status: Item["status"] =
        item.quantity <= 0
          ? "Out of Stock"
          : item.quantity <= 5
          ? "Low Stock"
          : "In Stock";
      const newItem: Item = { ...item, id, status };
      setItems([...items, newItem]);
      setError("");
    } catch (err) {
      setError("Failed to add item");
      console.error(err);
    }
  };

  const handleEditItem = async (
    id: string,
    item: Omit<Item, "id" | "status">
  ) => {
    try {
      await updateItem(id, item);
      const status: Item["status"] =
        item.quantity <= 0
          ? "Out of Stock"
          : item.quantity <= 5
          ? "Low Stock"
          : "In Stock";
      const updatedItems = items.map((existingItem) =>
        existingItem.id === id ? { ...item, id, status } : existingItem
      );
      setItems(updatedItems);
      setError("");
    } catch (err) {
      setError("Failed to update item");
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#003366] mb-4 md:mb-0">
          Inventory Management
        </h1>
        <button
          className="bg-[#003366] hover:bg-[#004488] text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          onClick={() => {
            setSelectedItem(undefined);
            setIsModalOpen(true);
          }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366] mx-auto"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Category", "Location", "Quantity", "Status"].map(
                    (header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#003366]"
                        onClick={() =>
                          handleSort(header.toLowerCase() as keyof Item)
                        }
                      >
                        <div className="flex items-center">
                          {header}
                          {sortConfig?.key === header.toLowerCase() && (
                            <span className="ml-2">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    )
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {item.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-[#003366] hover:text-[#004488] mr-4"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(undefined);
        }}
        onSave={async (item) => {
          if (selectedItem) {
            await handleEditItem(selectedItem.id, item);
          } else {
            await handleAddItem(item);
          }
        }}
        item={selectedItem}
      />
    </div>
  );
}
