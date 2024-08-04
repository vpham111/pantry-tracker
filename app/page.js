"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); 
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState(""); 


  const updateInventory = async () => {
    if (!user) return; // Only update if user is signed in
    const snapshot = query(collection(firestore, `inventory/${user}/items`));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };
  

  const handleSignIn = async () => {
    // Check if username exists or create a new user entry
    const userRef = doc(firestore, "users", username);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, { username });
    }
    setUser(username);
    handleCloseSignIn();
    await updateInventory();
  };
  
  const handleOpenSignIn = () => setOpenSignIn(true);
  const handleCloseSignIn = () => setOpenSignIn(false);
  

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user]);

  const addItem = async (item) => {
    if (!user) return;
    const docRef = doc(collection(firestore, `inventory/${user}/items`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };
  
  const removeItem = async (item) => {
    if (!user) return;
    const docRef = doc(collection(firestore, `inventory/${user}/items`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };
  

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      {/* Sign-In Modal */}
      <Modal
        open={openSignIn}
        onClose={handleCloseSignIn}
        aria-labelledby="modal-signin-title"
        aria-describedby="modal-signin-description"
      >
        <Box sx={style}>
          <Typography id="modal-signin-title" variant="h6" component="h2">
            Sign In
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-username"
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Modal>
  
      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-add-item-title"
        aria-describedby="modal-add-item-description"
      >
        <Box sx={style}>
          <Typography id="modal-add-item-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-item"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
  
      {/* Sign-In Button */}
      {!user && (
        <Button variant="contained" onClick={handleOpenSignIn}>
          Sign In
        </Button>
      )}
  
      {/* Add New Item Button */}
      {user && (
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
      )}
  
      {/* Search Items */}
      {user && (
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2, width: "800px" }}
        />
      )}
  
      {/* Inventory List */}
      {user && (
        <Box border={"1px solid #333"}>
          <Box
            width="800px"
            height="100px"
            bgcolor={"#ADD8E6"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
              Inventory Items
            </Typography>
          </Box>
          <Box width="800px" height="500px" overflow={"auto"} p={2}>
            <Grid container spacing={2}>
              {filteredInventory.map(({ name, quantity }) => (
                <Grid item xs={12} sm={6} md={4} key={name}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {quantity}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={2}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => addItem(name)}
                        >
                          Add
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => removeItem(name)}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
  
}
