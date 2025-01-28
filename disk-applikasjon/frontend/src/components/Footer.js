import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer>
            <div className="tekst">
                <h1>Over 5,000 Baner</h1>
                <p>Registrer resultater og forbedre din spillopplevelse</p>
            </div>

            <div className="footer2">
                <ul>
                    <li><a href="#">Baner</a></li>
                    <li><a href="#">Regler/Tips</a></li>
                    <li><a href="#">Klubber</a></li>
                    <li><a href="#">Nyheter</a></li>
                </ul>
            </div>

            <h1 className="t2">DiscGolf</h1>


            <div className="footer">
                <ul>
                    <li>
                        <p>Disc golf er en spennende utendørs sport der målet er å kaste en
                            frisbee i en kurv på færrest mulig kast. Med over 18 000 baner verden over,
                            er sporten i vekst og passer for spillere i alle aldre og ferdighetsnivåer.</p>
                    </li>
                </ul>

                <ul>
                    <li>
                        <p>© 2024 DiscGolf. All Rights Reserved.</p>
                    </li>
                </ul>

                <div className="info">
                    <p>Kontakt oss</p>
                    <p>Telefon:1256789</p>
                    <p>DiscgolfBø@gmail.com</p>
                    <p>BØ</p>
                    <p>Norway</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
