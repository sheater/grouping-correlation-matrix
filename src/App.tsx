import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import Papa from "papaparse";

import { NUMERICAL_COLUMNS, CATEGORICAL_COLUMNS } from "./consts";
import Visualisation from "./Visualisation";

export default function App() {
  const [data, setData] = React.useState<any>(null);
  const [font, setFont] = React.useState<Font | null>(null);

  React.useEffect(() => {
    const loader = new FontLoader();

    loader.load("/fonts/Raleway_Regular.json", function (item) {
      setFont(item);
    });

    fetch("/data/germany_housing_data.csv")
      .then((response) => response.text())
      .then((response) => {
        const { data } = Papa.parse<Array<string>>(response);

        const header = data[0];

        const cells = data.slice(1).map((row) => {
          const entry: Record<string, any> = {};

          header.forEach((column, index) => {
            if (NUMERICAL_COLUMNS.includes(column)) {
              const value = Number.parseFloat(row[index]);

              if (!Number.isNaN(value)) {
                entry[column] = value;
              }
            } else if (CATEGORICAL_COLUMNS.includes(column)) {
              if (row[index]?.length) {
                entry[column] = row[index];
              }
            }
          });

          return entry;
        });

        setData(cells);
      });
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
      {data && font ? (
        <Visualisation data={data} font={font} />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "calc(50% - 100px)",
            left: "calc(50% - 100px)",
          }}
        >
          <PacmanLoader color="#6600cc" loading={true} size={100} />
        </div>
      )}
    </div>
  );
}
