import React, {useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutValidinv from '../components/CheckoutValidinv';
import { debounce } from 'lodash';
import { getFilteredValidInv,getFilteredValidInvByCode,getInv}  from '../actions/validInvAction';
import 'jspdf-autotable';
import { Html5Qrcode } from "html5-qrcode";

function Validinv() {
    const dispatch = useDispatch();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const validInvstate = useSelector(state => state.getAllvalidInvReducer);
    const validInvCodestate = useSelector(state => state.getAllvalidInvByCodeReducer);
    const getInvState = useSelector((state) => state.getInvReducer);
    const [localData, setLocalData] = useState([]);
    const { getinv } = getInvState;
    const { validinv, error, loading } = validInvstate; 
    const {validinvcode} = validInvCodestate;
  const [scanner, setScanner] = useState(null);

    const [isScannerActive, setIsScannerActive] = useState(false);
 const [scanResult, setScanResult] = useState('');

useEffect(() => {
        let html5QrCode;

        if (isScannerActive) {
            html5QrCode = new Html5Qrcode("qr-reader");
            const config = {
                fps: 10,
                qrbox: 250,
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true,
                },
            };

            const cameraConfig = { facingMode: "environment" }; // Active la caméra arrière

            html5QrCode.start(
                cameraConfig,
                config,
                (decodedText) => {
                    setScanResult(decodedText);
                    setIsScannerActive(false); // Arrête le scanner après un scan réussi
                },
                (error) => {
                    console.warn("Erreur de scan : ", error);
                }
            ).then(() => setScanner(html5QrCode))
              .catch((err) => console.error("Erreur lors du démarrage du scanner", err));
        }

        return () => {
            if (html5QrCode) {
                html5QrCode.stop().then(() => html5QrCode.clear());
            }
        };
    }, [isScannerActive]);
  const debouncedDispatch = debounce((value) => {
      if (value.trim().length >= 3) {
          dispatch(getFilteredValidInv(value));}
  }, 500);

const handlechangeresult = (e) => {
        const value = e.target.value;
        setScanResult(value);
        setEANCOD_0(value);
    };
  const handleInputChange = (e) => {
      const value = e.target.value;
      setITMREF_0(value);
      debouncedDispatch(value);
  };
const handleInvSelection = async (refInv, itmref) => {
    setREFINV_0(refInv); // Mettez à jour l'inventaire sélectionné
    try {
        // Inclure le paramètre itmref dans la requête API
        const response = await fetch(
            `https://topinvapi2.onrender.com/api/validinv/getExistingDataForInv?refInv=${refInv}&itmref=${itmref}`
        );

        const existingData = await response.json();

console.log("Données retournées par l'API :", existingData);
        if (existingData && existingData.length > 0) {
            const updatedLocalData = localData.map((item) => {
                // Chercher une correspondance dans les données existantes
                const match = existingData.find(
                    (data) =>
                        data.ITMREF_0 === item.ITMREF_0 &&
                        data.LOT_0 === item.LOT_0 &&
                        data.STOFCY_0 === item.STOFCY_0
                );
                // Mettre à jour Qt si une correspondance est trouvée
                return match ? { ...item, Qt: match.QTYINV_0 } : item;
            });

            setLocalData(updatedLocalData);
            console.log("Données existantes pour l'inventaire :", existingData);
        } else {
            console.log("Aucune donnée correspondante trouvée pour cet inventaire.");
        } 

} catch (error) {
        console.error("Erreur lors de la récupération des données existantes :", error);
    }
};
 
  /*
  const handleInvSelection = async (refInv, itmref) => {
    setREFINV_0(refInv); // Mettez à jour l'inventaire sélectionné
    try {
        // Inclure le paramètre itmref dans la requête API
        const response = await fetch(
            `https://topinvapi2.onrender.com/api/validinv/getExistingDataForInv?refInv=${refInv}&itmref=${itmref}`
        );

        const existingData = await response.json();

        if (existingData && existingData.length > 0) {
            const updatedLocalData = localData.map((item) => {
                // Chercher une correspondance dans les données existantes
                const match = existingData.find(
                    (data) =>
                        data.ITMREF_0 === item.ITMREF_0 &&
                        data.LOT_0 === item.LOT_0 
                
                );
                // Mettre à jour Qt si une correspondance est trouvée
                return match ? { ...item, Qt: match.QTYINV_0 } : item;
            });

            setLocalData(updatedLocalData);
            console.log("Données existantes pour l'inventaire :", existingData);
        } else {
            console.log("Aucune donnée correspondante trouvée pour cet inventaire.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données existantes :", error);
    }
};
*/
  const debouncedCodeDispatch = debounce((value) => {
    if (value.trim().length >= 3) {
        dispatch(getFilteredValidInvByCode(value));}
}, 500);

 //la derniere   
const handleInputCodeChange = (e) => {
    const value = e.target.value;
    setEANCOD_0(value);

    // Recherche l'article correspondant dans localData
    const matchedItem = localData.find(item => item.EANCOD_0 === value);

    // Si un article est trouvé, met à jour ITMREF_0
    if (matchedItem) {
        setITMREF_0(matchedItem.ITMREF_0);
    } else {
      
    }

    debouncedCodeDispatch(value);
};
  const addNewRow = (e) => {
    e.preventDefault();
    const newRow = {
      STOCOU_0: `new-${Date.now()}`, // ID unique pour la nouvelle ligne
      LOT_0: '', // Valeur initiale pour LOT
      STOFCY_0: '', // Valeur initiale pour Emplacement
      Qt: '' // Valeur initiale pour Quantité
    };
    // Ajouter la nouvelle ligne en haut
    setLocalData([ ...localData,newRow]);
  };
 const deleteRow = (id) => {
    const updatedData = localData.filter((item) => item.STOCOU_0 !== id);
    setLocalData(updatedData);
  };
  const stockData = validinv?.stockData || [];
const itemMasterData = validinv?.itemMasterData || [];
useEffect(() => {
  if (validinv) {
    const stockDataArray = validinv.stockData || [];
    const itemMasterDataArray = validinv.itemMasterData || [];

    // Log the separate arrays to the console
    console.log("Stock Data:", stockDataArray);
    console.log("Item Master Data:", itemMasterDataArray);

    // Update the state with stock data and item master data separately
    setLocalData([
      ...stockDataArray.map((item) => ({ ...item, Qt: item.Qt || '' })),
      ...itemMasterDataArray.map((item) => ({ ...item, Qt: item.Qt || '' }))
    ]);
  } else {
    console.error("Both stockData and itemMasterData are undefined or not arrays", validinv);
  }
}, [validinv]);

    useEffect(() => {
      if (validinvcode) {
        // Copier les données pour un état local modifiable
        setLocalData(validinvcode.map((item) => ({ ...item, Qt: item.Qt || '' })));
      };     
    }, [validinvcode]);
    useEffect(() => {
      dispatch(getInv());
  }, [dispatch]);

    useEffect(() => {
    if (scanResult) {
        handleInputCodeChange({ target: { value: scanResult } });
    }
}, [scanResult]);

    // Gestion du popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [additionalQt, setAdditionalQt] = useState(""); 
    const openPopup = (id) => {
      setSelectedItemId(id);
      setIsPopupOpen(true);};  

    const closePopup = () => {
      setIsPopupOpen(false);
      setAdditionalQt("");};  

/*new start*/
const handleQtChange = (id, value) => {
  if (!isNaN(value) && value >= 0) {
    const updatedData = localData.map((item) =>
      item.STOCOU_0 === id ? { ...item, Qt: Number(value) } : item
    );
    setLocalData(updatedData);
  } else {
    console.log("Valeur invalide pour Qt.");
  }
};

const handleAddQt = () => {
  try {
    // Évaluer l'expression saisie dans l'input
    const evaluatedValue = eval(additionalQt.trim());

    // Vérification si le résultat est un nombre
    if (typeof evaluatedValue !== "number" || isNaN(evaluatedValue)) {
      alert("Veuillez entrer une expression mathématique valide.");
      return;
    }

    // Mettre à jour les données locales avec la nouvelle quantité
    const updatedData = localData.map((item) =>
      item.STOCOU_0 === selectedItemId
        ? { ...item, Qt: Number(item.Qt) + evaluatedValue } // Conversion explicite
        : item
    );

    setLocalData(updatedData); // Mise à jour de l'état
    closePopup(); // Fermer la popup
  } catch (error) {
    // Gestion des erreurs
    alert("Expression invalide. Veuillez réessayer.");
  }
};


  /* new end*/
    useEffect(() => {
    if (scanResult) {
        handleInputCodeChange({ target: { value: scanResult } });
    }
}, [scanResult]);
    
    const [REFINV_0, setREFINV_0] = useState('');
    
  
    const [DESINV_0, setDESINV_0] = useState('');
    const [ITMREF_0, setITMREF_0] = useState('');
    const [EANCOD_0, setEANCOD_0] = useState('');
    const [DESINV, setDESINV] = useState('');
  
 const resetInputs = () => {
        setREFINV_0('');
        setITMREF_0('');
   setEANCOD_0('');
        setLocalData([]);
    };

useEffect(() => {
    if (REFINV_0 && ITMREF_0) {
        handleInvSelection(REFINV_0, ITMREF_0);
    }
}, [REFINV_0, ITMREF_0, handleInvSelection]); // Ajoutez handleInvSelection aux dépendances
/*
useEffect(() => {
    if (REFINV_0 && ITMREF_0) {
        handleInvSelection(REFINV_0, ITMREF_0);
    }
}, [REFINV_0, ITMREF_0]);
  */
/* 
  useEffect(() => {
      if (REFINV_0 && ITMREF_0) {
        handleInvSelection(REFINV_0, ITMREF_0);
      }
    }, [REFINV_0,ITMREF_0]);

*/
     useEffect(() => {
    if (EANCOD_0.trim() !== "") {
      const matchedItem = localData.find((item) => item.EANCOD_0 === EANCOD_0);
      if (matchedItem) {
        setITMREF_0(matchedItem.ITMREF_0); // Remplit avec itmref trouvé
      } else {
       
      }
    } else {
     
    }
  }, [EANCOD_0, localData]);

  const renderDynamicFields = (item) => {
    // Convert dynamic fields into human-readable names
    const labels = {
      TSICOD_0: 'Famille',
      TSICOD_1: 'Sous Famille',
      ITMDES1_0: 'Désignation',
      EANCOD_0:'code'
    };

    return Object.entries(item).map(([key, value]) => {
      if (labels[key]) {
        return (
          <li key={key}>
            <span>{labels[key]} : </span>
            <p>{value}</p>
          </li>
        );
      }
      return null; // Ignore unlisted fields
    });
  };
   


    return (
        <div className='container col-xl-12 col-md-12 col-12 mx-auto cart-details'>
            <div className='justify-content-center mt-5 col-12 col-md-12'>
                <div className='col-md-12 col-12'>
   
                </div>
            </div>
            <form>
            <div className='col-md-12 col-xl-12 col-10 col-xs-10 mx-auto bg-white cart-client-infos'>
                
                  
                <div className="text-start w-100 col-xl-10 col-8 col-md-8 pb-2">                     
<div className="d-flex align-items-center mt-2">
    {/* Select Inventaire */}
    
<input
        
        type="text"
        placeholder="Code-barre"
        className="form-control col-xl-10 col-8 col-md-8 mx-auto"
        value={EANCOD_0}
        onChange={handleInputCodeChange}  // Met à jour le résultat du scan dans l'input
        style={{ width: '90%', fontSize: '13px' }}
      />

    {/* Bouton Scanner */}
    <button
        type="button" // Empêche le comportement par défaut
        onClick={(e) => {
            e.preventDefault(); // Empêche toute action par défaut
            setIsScannerActive(!isScannerActive);
        }}
         className="btn-Scan btn-primary"
    >
        <i className="fas fa-qrcode"></i> {/* Icône de scan */}
    </button>
</div>

{/* Scanner QR si actif */}
{isScannerActive && <div id="qr-reader" style={{ width: "100%" }} />}

            
    {/* Select Inventaire */}
    <select
    className="form-control mt-2 col-xl-10 col-10 col-md-10"
    value={REFINV_0}
    onChange={(e) => handleInvSelection(e.target.value)}
    style={{ width: '90%', fontSize: '13px' }}
>
    <option value="" disabled>
        Sélectionnez un inventaire
    </option>
    {getinv && getinv.length > 0 ? (
        getinv.map((inv, index) => (
            <option key={index} value={inv.REFINV_0}>
                {inv.DESINV_0}
            </option>
        ))
    ) : (
        <option disabled>Aucun inventaire disponible</option>
    )}
</select>

                          <input
                
                type="text"
                placeholder="Code-barre"
                className="form-control col-xl-10 col-10 col-md-10 mx-auto"
                value={EANCOD_0} // Résultat combiné (manuel + scan)
                onChange={(e) => handleInputCodeChange}
                style={{ display:'none',width: "90%", fontSize: "13px", marginTop: "10px" }}
            />

<input
                
                type="text"
                placeholder="Résultat QR Code"
                className="form-control col-xl-10 col-8 col-md-8 mx-auto"
                value={scanResult}
                onChange={handlechangeresult}
                style={{ display:'none',width: "90%", fontSize: "13px", marginTop: "10px" }}
            />
    
         
    <input
                
                type='text'
                placeholder='Code article'
                className='form-control col-xl-10 col-10 col-md-10 input-itmref'
                value={ITMREF_0}
                onChange={handleInputChange}
readOnly={EANCOD_0.trim() !== ''}
            />   

<ul className="itemref-details">
        {localData.map((item) => (
          <React.Fragment key={item.STOCOU_0}>
            {renderDynamicFields(item)}
          </React.Fragment>
        ))}
      </ul>

      {/* Button to open the calculator */}
    
                </div>
 
                 </div>
                                    
<div className='container'>
{localData.map((item) => (
<div className='row lot-details' key={item.STOCOU_0}>
  <div>
    <label>Lot</label>
    <input
          type="text"
          value={item.LOT_0}
          onChange={(e) => {
            const updatedData = localData.map((row) =>
              row.STOCOU_0 === item.STOCOU_0 ? { ...row, LOT_0: e.target.value } : row
            );
            setLocalData(updatedData);
          }}
          className="form-control mx-auto border p-1"
          style={{ width: "90%", fontSize: "13px" }}
        /></div>
  <div>
  <label>Emplacement</label>
  <input
          type="text"
          value={item.STOFCY_0}
          onChange={(e) => {
            const updatedData = localData.map((row) =>
              row.STOCOU_0 === item.STOCOU_0 ? { ...row, STOFCY_0: e.target.value } : row
            );
            setLocalData(updatedData);
          }}
          className="form-control mx-auto border p-1"
          style={{ width: "90%", fontSize: "13px" }}
        />
  </div>
<label>Quantité</label>
  <div style={{ display: "flex", alignItems: "center", width: "100%", marginLeft: "15px" }}>



<input
    type="number"
    value={item.Qt}
    onChange={(e) => handleQtChange(item.STOCOU_0, e.target.value)}
    className="form-control mx-auto border p-1"
    style={{ width: "90%", fontSize: "13px" }}
 disabled={true}
  />


  <button
    type='button'
    onClick={() => openPopup(item.STOCOU_0)}
    className="btn-plus bg-red-500 text-white"
    style={{ width: "10%", marginLeft: "8px", padding: "0" }}
  >
    +
  </button>
</div>




<div>

<button
          type="button"
          onClick={() => deleteRow(item.STOCOU_0)}
          className="btn10 btn-danger text-white px-3 py-1 rounded mx-auto"
          style={{ width: "10px" }}
        >
          x
        </button>

</div>

  </div>
  ))} 
</div>
  
  {isPopupOpen && (
  <div
    className="position-fixed top-0 left-0 w-60 h-100 popup bg-opacity-50 d-flex justify-content-center align-items-center"
  >
    <div className="p-4 rounded popup-details border w-100">
      <h3 className="text-lg font-bold mb-2">Ajouter une quantité</h3>
      <input
        type="text" // Permet les expressions comme "5+2"
        placeholder="Entrez une quantité ou une expression"
        className="form-control mb-4"
        value={additionalQt}
        onChange={(e) => setAdditionalQt(e.target.value)}
      />
      <div className="d-flex justify-content-end">
        <button onClick={closePopup} className="btn5 btn-secondary me-2">
          Annuler
        </button>
        <button onClick={handleAddQt} className="btn5 btn-primary">
          Ajouter
        </button>
      </div>
    </div>
  </div>
)}

                <div className="text-right mb-2">
  <button
    onClick={(e) => addNewRow(e)}
    className="btn btn-new bg-blue-500 text-white px-3 py-1"
  >
    Ajouter une ligne
  </button>
</div>
                
                </form>
           

            <footer className="menubar-area fot footer-fixed mt-2 cart-footer" style={{ backgroundColor: 'rgb(255,255,255)' }}>
                <div className='flex-container col-12'>
                  
                    <div className="menubar-nav d-flex justify-content-end col-10 mx-auto">
                    <CheckoutValidinv
    REFINV_0={REFINV_0}
    ITMREF_0={ITMREF_0}
    localData={localData}
      resetInputs={resetInputs}
/>
                    </div>
                </div>
            </footer>  

        </div>
    );
}

export default Validinv;
