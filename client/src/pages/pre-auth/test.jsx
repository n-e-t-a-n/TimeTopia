import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css"
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput} from 'mdb-react-ui-kit';

import { useAuth } from '../../providers/AuthContext.jsx';

const CustomInput = ({ field, form, ...props }) => (
  <MDBInput
    {...field}
    {...props}
    wrapperClass='mb-4'
    label={props.label}
    id={props.id}
    type={props.type}
  />
);

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

const Login = ({ setIsLogin }) => {
  const { login } = useAuth();

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">

      <MDBRow>

        {/* Left column container with background */}
        <MDBCol md='6' className="order-2 order-md-1">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample image"
          />
        </MDBCol>

        {/* Right column container */}
        <MDBCol md='6' className="order-1 order-md-2">

          <div className="relative mb-6" data-te-input-wrapper-init>
            <div className="text-center">
              <h1 className="mt-1 mb-5 pb-1">Sign In Here</h1>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await login(values);
                  setSubmitting(false);
                } catch (error) {
                  // Handle login error
                  console.error(error);
                  setSubmitting(false);
                }
              }}
            >
              <Form>
                {/* Separator between social media sign in and email/password sign in */}
                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0"></p>
                </div>
                {/* Email input */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <Field component={CustomInput} label='Email address' type="email" id="email" name="email" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>

                {/* Password input */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <Field component={CustomInput} label='Password' type="password" id="password" name="password" />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>

                <div className="text-center lg:text-left">
                  {/* Submit button */}
                  <MDBBtn className="mb-4 w-100" size="lg" type="submit">
                    Login
                  </MDBBtn>
                </div>
              </Form>
            </Formik>

            {/* Register button */}
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <MDBBtn outline className='mx-2' color='danger' onClick={() => setIsLogin(false)}>
                Register
              </MDBBtn>
            </div>
          </div>
        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
};

export default Login;