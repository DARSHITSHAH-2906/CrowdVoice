const {Ngo , NgoPosts} = require("../Models/Ngo");

const CreateNgo = async (req, res) => {
    try{
        const ngoData = req.body;
        const logo = req.file?.filename || null;
        ngoData.logo = logo ? `https://crowdvoice.onrender.com/uploads/image/${logo}` : null; // Assuming logo is an image file
        const userId = req.user._id; // Assuming user ID is available in req.user

        // Create a new NGO document
       await Ngo.create({
            ...ngoData,
            createdBy: userId,
            approved: false, // Default to false until approved by admin
        });
        res.status(200).json({message : "ngo created"}); 
    }   catch (error) {
        console.error("Error creating NGO:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }   
}

const FetchAllNgos = async (req, res) => {
    try {
        const ngos = await Ngo.find({ approved: false });

        res.status(200).json({ ngos });
    } catch (error) {
        console.error("Error fetching NGOs:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


module.exports = { CreateNgo, FetchAllNgos };