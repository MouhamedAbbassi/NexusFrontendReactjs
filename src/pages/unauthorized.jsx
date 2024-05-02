import React from 'react';
import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.text}>We're sorry, the page you are looking for could not be found.</p>
      <p style={styles.text}>You can return to the previous page using your browser's "Back" button, or go to our <Link to="/" style={styles.link}>homepage</Link>.</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  heading: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  link: {
    textDecoration: 'underline',
  },
};
