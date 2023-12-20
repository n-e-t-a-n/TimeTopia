import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../../providers/AuthContext.jsx'

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid username format')
    .required('Username is required'),

  name: Yup.string()
    .matches(/^[a-zA-Z. ]+$/, 'Invalid name format')
    .required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initialValues = {
  username: '',
  name: '',
  email: '',
  password: '',
};

const Register = ({ setIsLogin }) => {
  const { register } = useAuth();

  return (
    <div>
      <h1>Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          register(values);
          setSubmitting(false);
        }}
      >
        <Form>
          <div>
            <div> 
              <label htmlFor="username">Username:</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="name">Name:</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          <div>
            <button type="submit">Register</button>
          </div>
        </Form>
      </Formik>

      
      <button onClick={() => setIsLogin(true)}>Login</button>
    </div>
  );
};

export default Register;
