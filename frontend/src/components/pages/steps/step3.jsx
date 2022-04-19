import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../../context/userContext";
import Grid from "@mui/material/Grid";
import DrawerLayout from '../../layout/Drawer/DrawerLayout'
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Bag from '../../../assets/icons/bag.svg'
import { Container, Row, Col } from "react-bootstrap";
import ConfirmModal from '../../utils/Modal/ConfirmVaultModal';
import { VaultContext } from '../../../context/vaultContext';
import CheckIcon from "@mui/icons-material/Check";
import StepsCount from "../../utils/stepsCount/stepsCount";
import './step3.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function valuetext(value) {
  return `${value}°C`;
}



const Step3 = () => {
  const { userData, setUserData } = useContext(UserContext);
  console.log(userData);
  const [saldo, setSaldo] = useState('');
  const [invest, setInvest] = useState('');
  // Modal terms and use
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { funds, setFunds } = useContext(VaultContext);


  useEffect(() => {
    const datos = userData.user?.saldo
    setSaldo(datos)
    console.log(datos)
  }, [userData])

  function handleChange(evt) {
    const value = evt.target.value;
    setInvest(value);
    setFunds(value)
  }

  function handleSlider(value) {
    const valor = value.target.value
    const final = (saldo * (valor / 100));
    setInvest(final);
    setFunds(final);
  }

  return (
    <>
      <Container className="step3-container">
      <StepsCount />

        {userData.user ? (
          <Grid>
            <Grid item xs={12}>
              <h1 className="title-green" style={{ fontSize: '30px' }}>
                Saldo Disponible
              </h1>
            </Grid>
            <Grid item xs={12}>
              <div className="box-purple">
                <h3 className="saldo"> $ {saldo} </h3>
              </div>
            </Grid>


            <div className="center-input">
              <Box sx={{ flexGrow: 1 }} className="div-input">
                <Grid container spacing={2} columns={12} className='grid-cont-input'>
                  <Grid item xs={6}  className="bag">
                    <img src={Bag} width='50%'/>
                  </Grid>
                  <Grid item xs={6} className='input-amount'>
                    <input type='number' onChange={handleChange} value={invest} className='the-input'/>
                  </Grid>
                  <Grid item xs={12}>
                    <Slider
                      aria-label="Temperature"
                      defaultValue={30}
                      getAriaValueText={valuetext}
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={10}
                      max={100}
                      onChange={handleSlider}
                    />
                  </Grid>
                </Grid>
              </Box>

            </div>



            <Grid md={12}>
              <label className="tarifa">Tarifa de armado = 1%</label>
            </Grid>
            <Grid md={12}>
              <label className="disclaimer">

                Disclaimer: el mercado de criptomonedas es un mercado con mucho riesgo
                y volatilidad. Guuru no es un asesor financiero y no se responsabiliza por las
                posibles perdidas de valor que los activos puedan experimentar debido
                a los movimientos del mercado. Al utilizar Guuru, todos los usuarios aceptan
                bloquear sus fondos entendiendo dichos riesgos

              </label>

            </Grid>
            <Grid md={12}>
            <FormControlLabel control={<Checkbox  />} label="Aceptar" />

            </Grid>
            <Grid md={12}>
              <div className="btn-div">
                <button className="custom-btn btn-atras">Atras</button>
                
                  <button className="custom-btn btn-siguiente" onClick={handleOpen}>
                    Siguiente

                  </button>
                
              </div>
              <ConfirmModal open={open} handleClose={handleClose} />

            </Grid>


          </Grid>
        ) : (
          <h1>No existe</h1>
        )}
      </Container>
    </>
  );
};

export default Step3;
