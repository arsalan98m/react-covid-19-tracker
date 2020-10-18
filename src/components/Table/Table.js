import React from "react";
import "./Table.css";
import numeral from "numeral";
const Table = ({ countries }) => {
    return (
        <div className="table">
            <table>
                <tbody >
                    {countries.map(({ country, cases }, index) => (

                        <tr key={index}>
                            <td>{country}</td>
                            <td>{numeral(cases).format("0,0")}</td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table;