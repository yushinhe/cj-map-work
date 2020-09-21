import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createLogEntry } from './Api';


const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (error) {
            console.log(error);
            setError(error.message);
            setLoading(false);
        }
    }
    return (
        <form className="entry-form" onSubmit={handleSubmit(onSubmit)}>
             { error ? <h3 className="error">{error}</h3> : null }
            <label for="title" >Title</label>
            <input name="title" ref={register} />
            <label for="comments">Comments</label>
            <textarea name="comments" ref={register}/>
            <label for="description">Discription</label>
            <textarea name="description"ref={register}/>
            <label for="image">Image</label>
            <input name="image" ref={register} />
            <label for="visitDate">Visit Date</label>
            <input name="visitDate" type="date" ref={register} />
            <button disabled={loading}>{loading ? 'loading...' : 'Create Entry'}</button>
        </form>
    )
};
export default LogEntryForm;
