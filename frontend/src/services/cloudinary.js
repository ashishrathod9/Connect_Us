class CloudinaryService {
    constructor() {
      this.cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
      this.uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      this.apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY
    }
  
    async uploadImage(file, folder = 'connectus') {
      if (!this.cloudName || !this.uploadPreset) {
        throw new Error('Cloudinary configuration missing')
      }
  
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', this.uploadPreset)
      formData.append('folder', folder)
  
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )
  
        if (!response.ok) {
          throw new Error('Failed to upload image')
        }
  
        const data = await response.json()
        return {
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
        }
      } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw error
      }
    }
  
    async deleteImage(publicId) {
      if (!this.cloudName || !this.apiKey) {
        throw new Error('Cloudinary configuration missing')
      }
  
      try {
        // Note: For security, image deletion should typically be handled on the backend
        // This is a simplified version for demonstration
        console.log('Image deletion should be handled on backend for security:', publicId)
      } catch (error) {
        console.error('Cloudinary delete error:', error)
        throw error
      }
    }
  
    getOptimizedUrl(url, options = {}) {
      if (!url || !url.includes('cloudinary.com')) {
        return url
      }
  
      const {
        width = 'auto',
        height = 'auto',
        crop = 'fill',
        quality = 'auto',
        format = 'auto',
      } = options
  
      // Extract the public ID from the URL
      const urlParts = url.split('/')
      const uploadIndex = urlParts.findIndex(part => part === 'upload')
      
      if (uploadIndex === -1) return url
  
      const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`
      
      // Insert transformations after 'upload'
      urlParts.splice(uploadIndex + 1, 0, transformations)
      
      return urlParts.join('/')
    }
  }
  
  export default new CloudinaryService()
  