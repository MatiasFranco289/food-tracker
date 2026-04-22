"use client";
import axiosInstance from "@/axios";
import Header from "@/components/header";
import LoadingScreen from "@/components/loadingScreen";
import Modal from "@/components/modal";
import { GET_DIET_ENDPOINT } from "@/constants";
import { ApiDietEntry } from "@/interfaces";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AddAlimentModal from "@/components/addAlimentModal";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [newAlimentModalOpen, setNewAlimentModalOpen] =
    useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dietEntries, setDietEntries] = useState<Array<ApiDietEntry>>([]);
  const [macros, setMacros] = useState<
    Array<{ name: string; value: number; fill: string }>
  >([]);
  const date = searchParams.get("date");
  const today = new Date().toISOString().split("T")[0];

  const get_diet = () => {
    axiosInstance
      .get(GET_DIET_ENDPOINT, {
        params: {
          date: date || today,
        },
      })
      .then((data) => {
        const aliments: Array<ApiDietEntry> = data.data.data;

        setMacros([
          {
            name: "Carbos",
            value: Number(
              aliments
                .reduce(
                  (sum, entry) =>
                    sum +
                    Number(
                      Number(entry.carbos) * (Number(entry.quantity_g) / 100),
                    ),
                  0,
                )
                .toFixed(2),
            ),
            fill: "#00c951",
          },
          {
            name: "Protein",
            value: Number(
              aliments
                .reduce(
                  (sum, entry) =>
                    sum +
                    Number(
                      Number(entry.protein) * (Number(entry.quantity_g) / 100),
                    ),
                  0,
                )
                .toFixed(2),
            ),
            fill: "#fb2c36",
          },
          {
            name: "Fat",
            value: Number(
              aliments
                .reduce(
                  (sum, entry) =>
                    sum +
                    Number(
                      Number(entry.fat) * (Number(entry.quantity_g) / 100),
                    ),
                  0,
                )
                .toFixed(2),
            ),
            fill: "#efb100",
          },
        ]);

        setDietEntries(aliments);
      })
      .catch((err) => {
        setModalOpen(true);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const goToDay = (days: number) => {
    const todayDate = new Date(date || today);
    todayDate.setDate(todayDate.getDate() + days);
    const newDate = todayDate.toISOString().split("T")[0];
    router.push(`/home?date=${newDate}`);
  };

  useEffect(() => {
    get_diet();
  }, [date]);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col">
      {isLoading && <LoadingScreen />}

      {newAlimentModalOpen && (
        <AddAlimentModal
          date={date || today}
          setModalOpen={setNewAlimentModalOpen}
        />
      )}

      <Modal
        isOpen={modalOpen}
        setModalOpen={setModalOpen}
        title="Error"
        message="Something went wrong. Try again later."
      />
      <Header />

      {!isLoading && (
        <>
          <div className="w-full flex flex-col items-center mt-6">
            {/* Title */}
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl font-bold">Daily Diet</h2>

              <div className="flex justify-between space-x-4">
                <button onClick={() => goToDay(-1)}>
                  <FaChevronLeft />
                </button>

                <p className="text-gray-200">{date || today}</p>

                <button onClick={() => goToDay(1)}>
                  <FaChevronRight />
                </button>
              </div>
            </div>

            <div className="w-11/12 sm:w-4/6">
              <div className="w-full flex justify-center mb-4">
                <button
                  className="border border-white p-2 rounded-md  cursor-pointer hover:bg-slate-900 duration-200"
                  onClick={() => setNewAlimentModalOpen(true)}
                >
                  Add entry
                </button>
              </div>

              <div className="w-full overflow-x-auto rounded-lg">
                <table className="w-full divide-y divide-white bg-slate-900">
                  <thead>
                    <tr>
                      <th className="p-2 text-sm sm:text-base">Name</th>
                      <th className="p-2 text-sm sm:text-base">Grams</th>
                      <th className="p-2 text-sm sm:text-base">Carbos</th>
                      <th className="p-2 text-sm sm:text-base">Protein</th>
                      <th className="p-2 text-sm sm:text-base">Fat</th>
                      <th className="p-2 text-sm sm:text-base">Calories</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dietEntries.map((entry, i) => {
                      return (
                        <tr
                          key={`diet_entry_${i}`}
                          className={`text-center hover:bg-slate-950 duration-200 ${i % 2 == 0 ? "bg-slate-800" : "bg-slate-900"}`}
                        >
                          <td className="p-2 text-sm sm:text-base">
                            {entry.name}
                          </td>
                          <td className="p-2 text-sm sm:text-base">
                            {entry.quantity_g}
                          </td>
                          <td className="p-2 text-sm sm:text-base">
                            {(
                              Number(entry.carbos) *
                              (Number(entry.quantity_g) / 100)
                            ).toFixed(2)}
                          </td>
                          <td className="p-2 text-sm sm:text-base">
                            {(
                              Number(entry.protein) *
                              (Number(entry.quantity_g) / 100)
                            ).toFixed(2)}
                          </td>
                          <td className="p-2 text-sm sm:text-base">
                            {(
                              Number(entry.fat) *
                              (Number(entry.quantity_g) / 100)
                            ).toFixed(2)}
                          </td>
                          <td className="p-2 text-sm sm:text-base">
                            {(
                              Number(entry.calories) *
                              (Number(entry.quantity_g) / 100)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot className="text-center">
                    <tr className="bg-slate-700">
                      <td className="p-2 text-sm sm:text-base">Total</td>
                      <td className="p-2 text-sm sm:text-base">-</td>
                      <td className="p-2 text-sm sm:text-base">
                        {macros[0].value}
                      </td>
                      <td className="p-2 text-sm sm:text-base">
                        {macros[1].value}
                      </td>
                      <td className="p-2 text-sm sm:text-base">
                        {macros[2].value}
                      </td>

                      <td className="p-2 text-sm sm:text-base">
                        {dietEntries
                          .reduce(
                            (sum, entry) =>
                              sum +
                              Number(
                                Number(entry.calories) *
                                  (Number(entry.quantity_g) / 100),
                              ),
                            0,
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full h-100 flex flex-col items-center mt-10">
            <h2 className="text-xl font-bold">Macros</h2>
            {dietEntries.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={macros}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={true}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="mt-4">
                <h3 className="text-white/40 text-xl">Still no data</h3>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
