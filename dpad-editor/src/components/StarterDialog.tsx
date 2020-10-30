import React, { Fragment, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Divider,
  ButtonGroup,
  Button,
  DialogActions,
} from "@material-ui/core";

export default function StarterDialog() {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  const [createDoc, setCreateDoc] = useState(false);
  const [joinDoc, setJoinDoc] = useState(false);
  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Welcome to Dpad!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dpad is a decentralized online collaborative editor that keeps your
            data private and safe!
          </DialogContentText>
          <Divider />
          <ButtonGroup
            orientation="vertical"
            color="primary"
            aria-label="start-button-group"
            variant="text"
            fullWidth
          >
            <Button
              onClick={() => {
                setCreateDoc(true);
                setOpen(false);
              }}
            >
              Create a new document
            </Button>
            <Button
              onClick={() => {
                setJoinDoc(true);
                setOpen(false);
              }}
            >
              Join an existing document
            </Button>
            <Button onClick={handleClose}>Offline mode</Button>
          </ButtonGroup>
        </DialogContent>
      </Dialog>

      <Dialog open={createDoc} fullWidth={true}>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            id="create-document-name-input"
            label="Document name"
          />
          <TextField
            margin="dense"
            fullWidth
            id="create-password-input"
            label="password"
          />
          <DialogActions>
            <Button
              onClick={() => {
                setCreateDoc(false);
                setOpen(true);
              }}
            >
              Back
            </Button>
            <Button onClick={() => setCreateDoc(false)} color="primary">
              Create
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={joinDoc} fullWidth={true}>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            id="join-clientid-input"
            label="Cliend Id"
          />
          <TextField
            margin="dense"
            fullWidth
            id="join-document-name-input"
            label="Document Name"
          />
          <TextField
            margin="dense"
            fullWidth
            id="join-password-input"
            label="Password"
          />
          <DialogActions>
            <Button
              onClick={() => {
                setJoinDoc(false);
                setOpen(true);
              }}
            >
              Back
            </Button>
            <Button onClick={() => setJoinDoc(false)} color="primary">
              Join
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
