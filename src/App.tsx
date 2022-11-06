/* eslint-disable react/style-prop-object */
import { Viewer } from "./Viewer/Viewer";
import "./App.css";
import { useState } from "react";
import { Button, Grid, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import isMobile from "is-mobile";

const assetUrl = ""

function App() {
  const [modelLoading, setModelLoading] = useState(true);
  const [viewerInit, setViewerInit] = useState(undefined);
  const [selcetionMode, setSelcetionMode] = useState(true);
  const [price, setPrice] = useState(1000);
  const priceBase = 1000;
  const [selctedmfdc, setSelctedmfdc] = useState({ m: "", f: "", d: "", sc: "", bc: "" });

  const fabrics = ['Cotton'];
  const designs = ['Saree_1_DIFF1', 'Saree_1_DIFF2', 'Saree_1_DIFF3', 'Saree_1_DIFF4'];
  const sarerColor = ['Black', 'Blue', 'Gray', 'Pink', 'Red', 'Violet'];
  const blouseColor = ['Black', 'Blue', 'Gray', 'Pink', 'Red', 'Violet'];

  const allModelLoadCallback = () => {
    setModelLoading(false);
  }

  const onViewerInit = (obj: Viewer) => {
    //@ts-ignore
    setViewerInit(obj);
  }

  const modelSelectCallback = async (model: { name: string, id: number }) => {
    setModelLoading(true);
    setSelcetionMode(false);
    //@ts-ignore
    viewerInit.loadSelectedModels(model.name, assetUrl + "Saree_1_DIFF1", "Black", "Black", true);
    await setSelctedmfdc({ m: model.name + "", f: selctedmfdc.f, d: assetUrl + "Saree_1_DIFF1", sc: "Black", bc: "Black" });
    setPrice(1000);
  }

  const backClick = () => {
    setModelLoading(true);
    setSelcetionMode(true);
    //@ts-ignore
    viewerInit.loadInitModels([assetUrl + 'models/Girl_1.gltf', assetUrl + 'models/Girl_2.gltf', assetUrl + 'models/Girl_3.gltf']);
  }

  const fabricClick = (fabricName: string) => {
    setSelctedmfdc({ m: selctedmfdc.m, f: fabricName, d: selctedmfdc.d, sc: selctedmfdc.sc, bc: selctedmfdc.bc });
    console.log(fabricName);
  }

  const designClick = (designName: string, index: number) => {
    setModelLoading(true);
    setSelctedmfdc({ m: selctedmfdc.m, f: selctedmfdc.f, d: designName, sc: selctedmfdc.sc, bc: selctedmfdc.bc });
    //@ts-ignore
    viewerInit.loadSelectedModels(selctedmfdc.m, assetUrl + designName, selctedmfdc.sc, selctedmfdc.bc, false);
    setPrice(priceBase + (Number(selctedmfdc.d) * 100 * 2))
  }

  const sareeColorClick = (colorName: string, index: number) => {
    setModelLoading(true);
    setSelctedmfdc({ m: selctedmfdc.m, f: selctedmfdc.f, d: selctedmfdc.d, sc: colorName, bc: selctedmfdc.bc });
    //@ts-ignore
    viewerInit.loadSelectedModels(selctedmfdc.m, selctedmfdc.d, colorName, selctedmfdc.bc, false);
    console.log(colorName);
    setPrice(priceBase + (Number(selctedmfdc.d) * 100 * 2) + colorName.length * 50);
  }


  const blouseColorClick = (colorName: string, index: number) => {
    setModelLoading(true);
    setSelctedmfdc({ m: selctedmfdc.m, f: selctedmfdc.f, d: selctedmfdc.d, bc: colorName, sc: selctedmfdc.sc });
    //@ts-ignore
    viewerInit.loadSelectedModels(selctedmfdc.m, selctedmfdc.d, selctedmfdc.sc, colorName, false);
    setPrice(priceBase + (Number(selctedmfdc.d) * 100 * 2) + colorName.length * 50);
  }


  return (
    <div style={{ backgroundImage: "radial-gradient(90% 100% at center top, rgb(0, 0, 0), rgb(12, 12, 12))" }}>
      <div className="allow-rotate" ></div>
      {modelLoading ? (
        <div className="centered">
          <div className="loader" />
        </div>
      ) : (
        <span />
      )}
      <Viewer selectionMode={selcetionMode} allModelLoadCallback={allModelLoadCallback} modelSelectCallback={modelSelectCallback} onViewerInit={onViewerInit} />
      {
        !selcetionMode ?
          <Button style={{ position: "fixed", top: "10px", left: "10px", zIndex: "1000000", color: "white", border: "1px solid rgb(255 255 255 / 50%)" }} variant="outlined" onClick={backClick}>
            <ArrowBackIcon style={{ paddingRight: "5px" }} /> BACK </Button >
          : <div className="select-model" >Select one model </div>}
      {
        !selcetionMode ? (
          <div>
            <Grid container spacing={2} style={{ position: "fixed", zIndex: "1000000", pointerEvents: "none", padding: "10px", bottom: isMobile({ tablet: true }) ? "0px" : "40%" }}>
              <Grid item xs={6} md={8} >
              </Grid>
              <Grid item xs={12} md={3} >
                <TableContainer component={Paper} elevation={3} style={{ marginTop: "2%", pointerEvents: "all" }}>
                  <Table aria-label="caption table">
                    <TableHead >
                      <TableRow style={{ background: "orange" }}>
                        <TableCell align="center" colSpan={4} style={{ padding: "2px", lineHeight: 1.2, }} >Design</TableCell>
                      </TableRow>
                      <TableRow>
                        {designs.map((currentDesign, index) => (
                          <TableCell key={currentDesign} align="center" style={{ padding: "2px",  maxWidth: "150px" }} onClick={() => designClick(currentDesign, index)}>
                            <div className={"tableValue " + (currentDesign === selctedmfdc.d ? "selected" : "")} style={{ backgroundImage: 'url("./thumb/' + currentDesign + '.jpg")' }}>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
                <TableContainer component={Paper} elevation={3} style={{ marginTop: "2%", pointerEvents: "all" }}>
                  <Table aria-label="caption table">
                    <TableHead >
                      <TableRow style={{ background: "orange" }}>
                        <TableCell align="center" colSpan={6} style={{ padding: "2px", lineHeight: 1.2 }} >Saree Color</TableCell>
                      </TableRow>
                      <TableRow>
                        {sarerColor.map((colorColor, index) => (
                          <TableCell key={colorColor} align="center" onClick={() => sareeColorClick(colorColor, index)} style={{ padding: "2px", maxWidth: "150px" }}>
                            <div className={"tableValue " + (colorColor === selctedmfdc.sc ? "selected" : "")} style={{ backgroundColor: colorColor }}>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
                <TableContainer component={Paper} elevation={3} style={{ marginTop: "2%", pointerEvents: "all" }}>
                  <Table aria-label="caption table">
                    <TableHead >
                      <TableRow style={{ background: "orange" }}>
                        <TableCell align="center" colSpan={6} style={{ padding: "2px", lineHeight: 1.2 }} >Blouse Color</TableCell>
                      </TableRow>
                      <TableRow>
                        {blouseColor.map((colorColor, index) => (
                          <TableCell key={colorColor + "01"} align="center" onClick={() => blouseColorClick(colorColor, index)} style={{ padding: "2px" }}>
                            <div className={"tableValue " + (colorColor === selctedmfdc.bc ? "selected" : "")} style={{ backgroundColor: colorColor }}>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={3} md={1} >
              </Grid>
            </Grid>
          </div>
        )
          : <span />
      }
    </div >
  );
}

export default App;


//<TableContainer component={Paper} elevation={3} style={{ pointerEvents: "all" }}>
//<Table sx={{ minWidth: 320 }} aria-label="caption table">
 // <TableHead style={{ background: "orange" }}>
 //   <TableRow>
 //     <TableCell align="center" style={{ padding: "3px" }} >FABRIC</TableCell>
 //     {/* <TableCell color="white" >DESIGNS</TableCell>
 //       <TableCell color="white" >COLOUR</TableCell> */}
 //   </TableRow>
 // </TableHead>
 // <TableBody>
 //   {fabrics.map((fabric) => (
 //     <TableRow>
 //       <TableCell align="center" style={{ padding: "3px" }} onClick={() => fabricClick(fabric)}> {fabric} </TableCell>
 //     </TableRow>
  //  ))}
 // </TableBody>
//</Table>
//</TableContainer>