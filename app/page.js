"use client"
import { Box, Typography, Button, Modal, TextField } from "@mui/material"
import { Stack } from "@mui/material"
import { firestore } from "@/firebase";
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  border: '2px solid #FFC0CB',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3
};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState("")

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() })
    })
    setPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async (item) => {
    const docRef = await doc(collection(firestore, "pantry"), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + 1 })
    } else {
      await setDoc(docRef, { count: 1 })
    }
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      if (count === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { count: count - 1 })
      }
    }
    await updatePantry()
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      gap={3}
      bgcolor={"#1E1E1E"} // Dark background color
      color={"#E0E0E0"} // Light text color
      p={4}
    >
      <Typography
        variant="h2"
        color={"#FFC0CB"}
        marginBottom={3}
        sx={{ fontFamily: 'Times New Roman, serif' }} // Set font to Times New Roman
      >
        WELCOME TO PANTRY TRACKER!
      </Typography>

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleOpen} 
        sx={{ marginBottom: 3 }}
      >
        Add Item
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="white">
            Add Item
          </Typography>
          <Stack direction={"row"} width="100%" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{ style: { color: 'white' } }} // Set input text color
              InputLabelProps={{ style: { color: 'white' } }} // Set input label color
            />
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => {
                addItem(itemName)
                setItemName("")
                handleClose()
              }}
            > 
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box 
        width="100%"
        maxWidth="800px"
        borderRadius={2}
        overflow="hidden"
        boxShadow={3}
        bgcolor={"#2C2C2C"}
        p={2}
      >
        <Box
          width="100%"
          height="80px"
          bgcolor={"#333"} // Darker background for header
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          borderBottom={"1px solid #444"}
        >
          <Typography variant={"h4"} color={"#FFC0CB"} textAlign={"center"}>
            P A N T R Y  -  I T E M S 
          </Typography>
        </Box>
        <Stack width="100%" spacing={2} padding={2}>
          {pantry.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#3C3C3C"}
              padding={2}
              borderRadius={1}
              boxShadow={1}
            >
              <Typography 
                variant={"h6"} 
                color={"#E0E0E0"} 
                sx={{ fontFamily: 'Comic Sans MS, cursive' }} // Set font to Comic Sans for item names
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                variant={"body1"} 
                color={"#E0E0E0"} 
                sx={{ fontFamily: 'Comic Sans MS, cursive' }} // Set font to Comic Sans for item quantities
              >
                Quantity: {count}
              </Typography>
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
