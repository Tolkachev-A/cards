import React, { ReactElement, useCallback, useState } from 'react';

import { Box, FormGroup } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl/FormControl';
import Grid from '@mui/material/Grid/Grid';
import Paper from '@mui/material/Paper/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { setAppStatusAC } from 'app/actions';
import { useAppSelector, useAppDispatch } from 'common/hooks';
import commonStyle from 'common/style/style.module.css';
import { InputEyeSwitcher } from 'features/Auth/components/SignUp/components/TextField/InputEyeSwitcher';
import { Title } from 'features/Auth/components/SignUp/components/Title/Title';
import { updatePassword } from 'features/Auth/reducer/passwordRecoveryReducer';

export const NewPassword = (): ReactElement => {
  const [visible, setVisible] = useState(false);
  const isRegistered = useAppSelector(state => state.signUp.isSignUp);
  const status = useAppSelector(state => state.app.status);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams<'token'>();
  const { token } = params;

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Please Enter your password')
        .matches(
          /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
          'Must Contain 8 Characters, One Number and Letter',
        ),
    }),
    onSubmit: values => {
      if (token) {
        dispatch(updatePassword(values.password, token));
      }
      formik.resetForm();
    },
  });

  const disabled = formik.touched.password && !!formik.errors.password;
  const inputEyeSwitcher = useCallback(() => setVisible(!visible), [visible]);

  if (status === 'succeeded') {
    dispatch(setAppStatusAC('idle'));
    navigate('/Login');
  }

  return (
    <Paper elevation={20} className={commonStyle.paperStyle}>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ mb: 5 }}>
            <Title isRegistered={isRegistered} headerText=" Create new password" />
          </Box>
          <FormControl>
            <FormGroup>
              <TextField
                type={visible ? 'text' : 'password'}
                label="Password"
                variant="standard"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                onBlur={formik.handleBlur}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputEyeSwitcher visible={visible} callback={inputEyeSwitcher} />
                  ),
                }}
              />
              <Typography
                sx={{ fontSize: 14, mt: 3 }}
                color="text.secondary"
                gutterBottom
              >
                Create new password and we will send you further instructions to email
              </Typography>
              <Button
                type="submit"
                variant="contained"
                disabled={disabled}
                className={commonStyle.btnStyle}
              >
                Create new password
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Paper>
  );
};
