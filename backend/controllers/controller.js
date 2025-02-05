// Global arrays para almacenar datos
let links = [];
let comments = [];

// Controlador de Links
const LinkController = {
    createLink: (req, res) => {
        const { title, url, description, tags } = req.body;

        if (!title || !url) {
            return res.status(400).json({ message: "Title and URL are required" });
        }

        if (!url.startsWith("http")) {
            return res.status(400).json({ message: "URL must start with http" });
        }

        const newLink = {
            id: Date.now().toString(),
            title,
            url,
            description,
            tags: tags || [],
            votes: 0
        };

        links.push(newLink);
        res.status(201).json({ link: newLink, message: "Link created" });
    },

    getAllLinks: (req, res) => {
        res.status(200).json({ links, message: "Links successfully retrieved" });
    },

    getLinkById: (req, res) => {
        const { linkId } = req.params;
        const link = links.find(l => l.id === linkId);

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }
        res.status(200).json({ link, message: "Link successfully retrieved" });
    },

    updateLink: (req, res) => {
        const { linkId } = req.params;
        const updates = req.body;

        const linkIndex = links.findIndex(l => l.id === linkId);
        if (linkIndex === -1) {
            return res.status(404).json({ message: "Link not found" });
        }

        links[linkIndex] = { ...links[linkIndex], ...updates };
        res.status(200).json({ link: links[linkIndex], message: "Link updated" });
    },

    deleteLink: (req, res) => {
        const { linkId } = req.params;
        const initialLength = links.length;
        links = links.filter(l => l.id !== linkId);

        if (links.length === initialLength) {
            return res.status(404).json({ message: "Link not found" });
        }
        res.status(200).json({ message: "Link deleted" });
    },

    voteLink: (req, res) => {
        const { linkId } = req.params;
        const { vote } = req.body;
    
        // Forzar conversión a número
        const voteNumber = Number(vote);
    
        const link = links.find(l => l.id === linkId);
        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }
    
        // Usar voteNumber para sumar
        link.votes += voteNumber;
        res.status(200).json({ link, message: "Link voted" });
    }
};

// Controlador de Comments
const CommentController = {
    createComment: (req, res) => {
        const { linkId } = req.params;
        const { content, email } = req.body;

        const link = links.find(l => l.id === linkId);
        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        const newComment = {
            id: Date.now().toString(),
            linkId,
            content,
            email,
            createdAt: new Date()
        };

        comments.push(newComment);
        res.status(201).json({ comment: newComment, message: "Comment created successfully" });
    },

    getComments: (req, res) => {
        const { linkId } = req.params;
        const linkComments = comments.filter(c => c.linkId === linkId);
        
        res.status(200).json({ comments: linkComments });
    }
};

module.exports = { LinkController, CommentController };