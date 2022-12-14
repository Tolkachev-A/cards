import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';
import Button from '@mui/material/Button/Button';
import FormControl from '@mui/material/FormControl/FormControl';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import Grid from '@mui/material/Grid/Grid';
import Paper from '@mui/material/Paper/Paper';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { Navigate, useNavigate } from 'react-router-dom';

import { setAppStatusAC } from 'app/actions';
import { ErrorSnackbar } from 'common/components/ErrorSnackbar/ErrorSnackbar';
import { RoutePath } from 'common/enums';
import { useAppDispatch } from 'common/hooks/useAppDispatch';
import { useAppSelector } from 'common/hooks/useAppSelector';
import { selectIsAuth, selectIsSignUp, selectStatus } from 'common/store';
import commonStyle from 'common/style/style.module.css';
import { setIsSignUpAC } from 'features/Auth/actions';
import { InputEyeSwitcher } from 'features/Auth/components/SignUp/components/TextField/InputEyeSwitcher';
import { Title } from 'features/Auth/components/SignUp/components/Title/Title';
import { signUpTC } from 'features/Auth/reducer';

type FormikErrorType = {
  email?: string;
  password?: string;
  confirmPass?: string;
};

export const SignUp = (): ReactElement => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const status = useAppSelector(selectStatus);
  const isAuth = useAppSelector(selectIsAuth);
  const isRegistered = useAppSelector(selectIsSignUp);

  const [visible, setVisible] = useState(false);

  const typographyText = isRegistered
    ? 'Registration successful!'
    : 'Please fill this form to create an account';
  const isLoading = status === 'loading';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPass: '',
    },
    validate: values => {
      const errors: FormikErrorType = {};

      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'Required';
        // eslint-disable-next-line no-magic-numbers
      } else if (formik.values.password.length < 7) {
        errors.password = 'must be more than 7 characters';
      }
      if (values.confirmPass !== values.password) {
        errors.confirmPass = "Passwords don't match";
      }

      return errors;
    },
    onSubmit: values => {
      const signUpData = { email: values.email, password: values.password };

      dispatch(signUpTC(signUpData));
    },
  });

  useEffect(() => {
    if (isRegistered) {
      const redirect = setTimeout(() => {
        dispatch(setIsSignUpAC(false));
        navigate(RoutePath.LOGIN);
        // eslint-disable-next-line no-magic-numbers
      }, 2000);

      return () => {
        clearTimeout(redirect);
      };
    }
  }, [isRegistered]);

  const onBackToLoginClick = useCallback(() => {
    dispatch(setAppStatusAC('idle'));
    navigate('/Login');
  }, []);

  const inputEyeSwitcher = useCallback(() => setVisible(!visible), [visible]);
  const isEmailFieldError = formik.errors.email !== undefined;
  const isPasswordFieldError = formik.touched.password && !!formik.errors.password;
  const isConfirmPassFieldError =
    formik.touched.confirmPass && !!formik.errors.confirmPass;

  if (isAuth) {
    return <Navigate to={RoutePath.PROFILE} />;
  }

  return (
    <Paper elevation={20} className={commonStyle.paperStyle}>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Title
          typographyText={typographyText}
          isRegistered={isRegistered}
          headerText="SIGN UP"
        />
        {isRegistered ? (
          <h3>You will be redirected to login page</h3>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl>
              <FormGroup className={commonStyle.formInner}>
                <TextField
                  error={isEmailFieldError}
                  helperText={formik.errors.email}
                  disabled={isLoading}
                  label="Email"
                  variant="standard"
                  margin="normal"
                  {...formik.getFieldProps('email')}
                />
                <TextField
                  error={isPasswordFieldError}
                  helperText={isPasswordFieldError && formik.errors.password}
                  disabled={isLoading}
                  type={visible ? 'text' : 'password'}
                  variant="standard"
                  label="Password"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputEyeSwitcher visible={visible} callback={inputEyeSwitcher} />
                    ),
                  }}
                  {...formik.getFieldProps('password')}
                />
                <TextField
                  error={isConfirmPassFieldError}
                  helperText={isConfirmPassFieldError && formik.errors.confirmPass}
                  disabled={isLoading}
                  type={visible ? 'text' : 'password'}
                  variant="standard"
                  label="Confirm password"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputEyeSwitcher visible={visible} callback={inputEyeSwitcher} />
                    ),
                  }}
                  {...formik.getFieldProps('confirmPass')}
                />

                <Button
                  disabled={isLoading}
                  className={commonStyle.btnStyle}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isLoading ? 'WAIT' : 'SIGN UP'}
                </Button>
              </FormGroup>
            </FormControl>
          </form>
        )}
        {!isRegistered && (
          <Typography
            sx={{ fontSize: 14, mt: 4, mb: 2 }}
            color="text.secondary"
            gutterBottom
          >
            Already have an account?
          </Typography>
        )}

        <Button size="small" onClick={onBackToLoginClick}>
          <Box sx={{ borderBottom: 2, lineHeight: 1 }}>Sign In</Box>
        </Button>
      </Grid>
      <ErrorSnackbar />
    </Paper>
  );
};
