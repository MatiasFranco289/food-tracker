import axiosInstance from "@/axios";
import { ADD_ENTRY_ENDPOINT, SEARCH_FOOD_ENDPOINT } from "@/constants";
import { FoodResult } from "@/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

interface AddAlimentModalProps {
  date: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddAlimentModal({
  date,
  setModalOpen,
}: AddAlimentModalProps) {
  const [query, setQuery] = useState<string>("");
  const [grams, setGrams] = useState<string>("");
  const [results, setResults] = useState<Array<FoodResult>>([]);
  const [selectedFood, setSelectedFood] = useState<FoodResult>();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      axiosInstance
        .get(SEARCH_FOOD_ENDPOINT, {
          params: {
            search: query,
          },
        })
        .then((res) => {
          setResults(res.data.data);
        });
    };

    const timer = setTimeout(() => {
      fetchData();
    });

    return () => clearTimeout(timer);
  }, [query]);

  const onFoodSelect = (food: FoodResult) => {
    setSelectedFood(food);
  };

  const addFood = () => {
    if (!selectedFood || !grams || isLoading) return;
    setLoading(true);

    axiosInstance
      .post(ADD_ENTRY_ENDPOINT, {
        food_id: selectedFood.id,
        quantity_g: grams,
        date: date,
      })
      .finally(() => {
        setLoading(false);
        window.location.reload();
        setModalOpen(false);
      });
  };

  return (
    <div className="bg-white/20 fixed top-0 left-0 w-screen h-screen z-50 flex justify-center items-center">
      <div className="bg-slate-950 p-4 rounded-lg flex flex-col relative">
        <h2 className="text-2xl font-bold text-center">Add entry</h2>

        <button
          className="absolute top-0 right-0 p-2"
          onClick={() => setModalOpen(false)}
        >
          <IoClose className="text-3xl" />
        </button>

        <input
          type="text"
          value={selectedFood ? selectedFood.name : query}
          onChange={(e) => {
            setSelectedFood(undefined);
            setQuery(e.target.value);
          }}
          placeholder="Search food..."
          className="border border-white p-2 rounded-lg mt-4"
        />

        <input
          type="numeric"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          placeholder="Grams"
          className="border border-white p-2 rounded-lg mt-4"
        />

        {results.length > 0 && !selectedFood && (
          <div>
            {results.map((r, index) => {
              return (
                <button
                  key={`food_result_${index}`}
                  className="bg-slate-900 w-full p-2 rounded-sm cursor-pointer hover:bg-slate-800 duration-200"
                  onClick={() => onFoodSelect(r)}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
        )}

        <button
          className={`w-full border border-white p-2 rounded-md mt-6 ${selectedFood && grams ? "hover:bg-slate-800 cursor-pointer" : ""}`}
          onClick={() => addFood()}
        >
          {isLoading ? "Loading ..." : "Add"}
        </button>
      </div>
    </div>
  );
}
