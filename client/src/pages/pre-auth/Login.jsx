import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css"
import '../../pages/pre-auth/pre_auth_design/forms.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBInput} from 'mdb-react-ui-kit';

import { useAuth } from '../../providers/AuthContext.jsx';

const CustomInput = ({ field, form, ...props }) => (
  <MDBInput
    {...field}
    {...props}
    wrapperClass='mb-2'
    label={props.label}
    id={props.id}
    type={props.type}
    className="p-4"
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
    <MDBContainer fluid>

      <MDBRow className="p-3 my-5 m-1 align-items-center">

        {/* Left column container with background */}
        <MDBCol md='6' className="order-1 order-md-1">
          <img
            src="../../img/Time_topia_smol.png"
            className="img-fluid p-3"
            alt= "Welcome to TimeTopia... where TIME is in the palm of YOUR hands"
          />
        </MDBCol>

        {/* Right column container */}
        <MDBCol md='6' className="order-2 order-md-2">
        <div className="relative mb-6" data-te-input-wrapper-init>
            <div className="text-center">
              <h1 className="mt-1 ">Sign In Here</h1>
            {/* Separator between social media sign in and email/password sign in */}
            <div className="divider d-flex align-items-center my-3">
                <hr className="w-100" />
              </div>
        </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting })  => {
                try {
                  const response = await login(values);
                  
                  if(response.status === 201){
                    toast.success(response.message, {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      });
                      
                  } else {
                    toast.error(response.message, {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      })
                  }
                } catch (error) {
                  console.error(error);
      
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <Form>
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
                  <MDBBtn className="mb-4 w-100 yellow-scheme" size="lg" type="submit">
                    Login
                  </MDBBtn>
                </div>
              </Form>
            </Formik>

            {/* Register button */}
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0 pe-4">Don't have an account?</p>
              <MDBBtn outline className='center text' color='warning' onClick={() => setIsLogin(false)}>
                Register
              </MDBBtn>
            </div>
          </div>
        </MDBCol>

      </MDBRow>
        <MDBRow>
          <div className="text-center py-4 px-4 px-xl-5 green-scheme">
            <div className="text-white mb-3 mb-md-0">
              <p>Time at the Palm of your hands</p>
              <p>Copyright © 2023. All rights reserved.</p>
            </div>
          </div>
        </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
};

export default Login;