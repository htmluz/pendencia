import axios from "../api/axios";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { PiWarningFill, PiWarningOctagonFill } from "react-icons/pi";

function DashboardManu() {
  const [pendencias, setPendencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendencia();
  }, []);

  useEffect(() => {
    sorting();
  }, [!loading]);

  const loadPendencia = async () => {
    try {
      const response = await axios.get("/pendencias/get/dashboard");
      const manu = response.data.filter(
        (item) => item.tipo === "Campanha de Manutenção"
      );
      setPendencias(manu);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  function formataData(date) {
    date = moment(date);
    date.tz("America/Sao_Paulo");
    return date.format("DD/MM HH:mm");
  }

  function dataAviso(date) {
    date = moment(date);
    date.tz("America/Sao_Paulo");
    date = date.isBefore(moment().tz("America/Sao_Paulo"));
    return date;
  }

  const sorting = () => {
    const sorted = [...pendencias].sort((a, b) =>
      a["dateinit"] > b["dateinit"] ? 1 : -1
    );
    setPendencias(sorted);
  };

  function formataIncidente(incidente) {
    const reg = /iCodIncidente=(\d+)/;
    const match = incidente.match(reg);
    return match?.[1];
  }

  return (
    <>
      <table className="font-Inter w-[99%] text-[#ffffffde] mx-1">
        <thead className="text-left border-b-2 border-[#292929]">
          <tr className="cursor-default select-none">
            <th>Manutenção</th>
            <th>Responsável</th>
            <th>Início</th>
            <th>Previsão</th>
            <th>ID Eng</th>
            <th>Incidente</th>
          </tr>
        </thead>
        <tbody>
          {pendencias && pendencias.length
            ? pendencias.map((item) => (
                <tr
                  className="font-system text-lg hover:bg-[#12121266] transition-all cursor-default leading-8"
                  key={item.id}
                >
                  <td className="pl-1">{item.titulo}</td>
                  <td>{item.responsavel}</td>
                  <td>{formataData(item.dateinit)}</td>
                  <td>
                    <div className="flex">
                      {formataData(item.dateend)}
                      {dataAviso(item.dateend) ? (
                        <PiWarningOctagonFill className="mt-1 ml-1 text-red-500" />
                      ) : null}
                    </div>
                  </td>
                  <td className="flex">{item.taskid}</td>
                  <td>
                    {item.incidenturl ? (
                      <a
                        className="hover:text-[#aaaaaa]"
                        href={item.incidenturl}
                        target="_blank"
                      >
                        {formataIncidente(item.incidenturl)}
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </>
  );
}

export default DashboardManu;
