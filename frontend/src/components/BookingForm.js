// Example booking form component
const BookingForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.scheduledDate) {
      alert('Scheduled date is required');
      return;
    }

    const selectedDate = new Date(formData.scheduledDate);
    if (selectedDate <= new Date()) {
      alert('Please select a future date');
      return;
    }

    // Split date and time for backend
    const [bookingDate, bookingTime] = formData.scheduledDate.split('T');
    onSubmit({
      bookingDate,
      bookingTime: bookingTime ? bookingTime.slice(0, 5) : '', // "HH:MM"
      notes: formData.notes
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Scheduled Date:</label>
        <input
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
          required
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>
      
      <div>
        <label>Notes (Optional):</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Any special requirements or notes..."
        />
      </div>
      
      <div>
        <button type="submit">Book Service</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};