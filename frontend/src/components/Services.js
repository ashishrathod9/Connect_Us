// In your booking form submission
const onSubmit = async (formData) => {
  try {
    console.log('Form data received:', formData);
    
    // Prepare booking data without location
    const bookingData = {
      serviceId: service._id,
      scheduledDate: formData.scheduledDate,
      notes: formData.notes || ''
    };

    console.log('Sending booking data:', bookingData);
    
    const response = await BookingService.createBooking(bookingData);
    
    console.log('Booking response:', response);
    
    if (response.success) {
      alert('Booking created successfully!');
      // Reset form or redirect
      setShowBookingForm(false);
    }
  } catch (error) {
    console.error('Booking creation failed:', error);
    alert(`Booking failed: ${error.message}`);
  }
};