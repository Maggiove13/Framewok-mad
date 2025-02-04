const API_URL = 'http://localhost:3000/api';

const LinkManager = {
    root: null,
    links: [],

    init() {
        this.root = document.getElementById('app');
        this.setupRouting();
    },

    setupRouting() {
        window.addEventListener('hashchange', () => this.renderView()); // Cada vez que el hash cambia, se llama a la función renderView().
        this.renderView(); //renderiza la vista 
    },

    renderView() {
        const hash = window.location.hash; // Obtiene el hash actual de la URL
        
        if (hash.startsWith('#/link/')) {
            const linkId = hash.split('/')[2];
            this.renderLinkDetail(linkId);
        } else {
            this.renderLinkList();
        }
    },

    async renderLinkList() {
        this.root.innerHTML = `
            <h1>Link Manager</h1>
            <form id="linkForm"> 
                <input type="text" name="title" placeholder="Título" required>
                <input type="url" name="url" placeholder="URL" required>
                <input type="text" name="tags" placeholder="Tags (separadas por coma)">
                <textarea name="description" placeholder="Descripción"></textarea>
                <button type="submit">Crear Link</button>
            </form>
            <div id="linkFilter">
                <input type="text" id="tagFilter" placeholder="Filtrar por tag">
            </div>
            <div id="linkList"></div>
        `;

        await this.fetchLinks();
        this.setupLinkForm();
        this.setupTagFilter();
        this.renderLinks();
    },

    setupTagFilter() {
        const tagFilter = document.getElementById('tagFilter');
        tagFilter.addEventListener('input', () => {
            const filterValue = tagFilter.value.toLowerCase();
            const filteredLinks = this.links.filter(link => 
                link.tags.some(tag => tag.toLowerCase().includes(filterValue))
            );
            this.renderLinks(filteredLinks);
        });
    },

    async fetchLinks() {
        const response = await fetch(`${API_URL}/links`);
        const data = await response.json();
        this.links = data.links; // accedemos a la propiedad links del objeto data
    },

    renderLinks(linksToRender = this.links) {
        const linkList = document.getElementById('linkList');
        linkList.innerHTML = '';
    
        linksToRender.forEach(link => {
            const div = document.createElement('div');
            div.classList.add('link-card');
            div.innerHTML = `
                <h3>${link.title}</h3>
                <p>Tags: ${link.tags.join(', ')}</p>
                <div class="link-actions">
                    <button class="vote-btn" data-id="${link.id}">👍 (${link.votes || 0})</button>
                    <button class="edit-btn" data-id="${link.id}">Editar</button>
                    <button class="delete-btn" data-id="${link.id}">Eliminar</button>
                    <a href="#/link/${link.id}">Ver Detalles</a>
                </div>
            `;
            linkList.appendChild(div);
        });

        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', () => this.voteLink(btn.dataset.id, 1));
        });
    
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.editLink(btn.dataset.id));
        });
    
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteLink(btn.dataset.id));
        });
    },

    setupLinkForm() {
        const form = document.getElementById('linkForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const link = {
                title: formData.get('title'),
                url: formData.get('url'),
                description: formData.get('description'),
                tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t)
            };

            try {
                await fetch(`${API_URL}/links`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(link)
                });

                await this.fetchLinks();
                this.renderLinks();
                form.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo crear el enlace');
            }
        });
    },

    async editLink(linkId) {
        const link = this.links.find(l => l.id === linkId);
        if (!link) return;

        const newTitle = prompt('Editar título', link.title);
        const newUrl = prompt('Editar URL', link.url);
        const newDescription = prompt('Editar descripción', link.description);
        const newTags = prompt('Editar tags (separadas por coma)', link.tags.join(','));

        if (newTitle && newUrl) {
            try {
                await fetch(`${API_URL}/links/${linkId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: newTitle,
                        url: newUrl,
                        description: newDescription,
                        tags: newTags.split(',').map(t => t.trim()).filter(t => t)
                    })
                });


                await this.fetchLinks();
                this.renderLinks();
            } catch (error) {
                console.error('Error al editar:', error);
                alert('No se pudo editar el enlace');
            }
        }
    },

    async deleteLink(linkId) {
        if (confirm('¿Estás seguro de eliminar este enlace?')) {
            try {
                await fetch(`${API_URL}/links/${linkId}`, {
                    method: 'DELETE'
                });

                await this.fetchLinks();
                this.renderLinks();
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('No se pudo eliminar el enlace');
            }
        }
    },

    async renderLinkDetail(linkId) {
        try {
            const response = await fetch(`${API_URL}/links/${linkId}`);
            const data = await response.json();
            const link = data.link;

            this.root.innerHTML = `
                <div class="link-detail">
                    <h1>${link.title}</h1>
                    <div class="link-info">
                        <p><strong>URL:</strong> <a href="${link.url}" target="_blank">${link.url}</a></p>
                        <p><strong>Descripción:</strong> ${link.description}</p>
                        <div class="vote-section">
                            <button onclick="LinkManager.voteLink('${link.id}', 1)">👍 Votos: ${link.votes || 0}</button>
                        </div>
                    </div>

                    <h2>Comentarios</h2>
                    <form id="commentForm">
                        <input type="text" name="email" placeholder="Tu email" required>
                        <textarea name="content" placeholder="Escribe tu comentario" required></textarea>
                        <button type="submit">Enviar Comentario</button>
                    </form>

                    <div id="commentList"></div>

                    <a href="#/" class="back-link">Volver a la lista</a>
                </div>
            `;

            this.fetchAndRenderComments(linkId);
            this.setupCommentForm(linkId);
        } catch (error) {
            console.error('Error al cargar detalles:', error);
            this.root.innerHTML = '<p>No se pudieron cargar los detalles del enlace</p>';
        }
    },

    async fetchAndRenderComments(linkId) {
        try {
            const response = await fetch(`${API_URL}/links/${linkId}/comments`);
            const data = await response.json();
            const commentList = document.getElementById('commentList');
            
            commentList.innerHTML = data.comments.length > 0 
                ? data.comments.map(comment => `
                    <div class="comment">
                        <p>${comment.content}</p>
                        <small>Enviado por: ${comment.email}</small>
                    </div>
                `).join('')
                : '<p>No hay comentarios aún</p>';
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        }
    },

    setupCommentForm(linkId) {
        const form = document.getElementById('commentForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const comment = {
                email: formData.get('email'),
                content: formData.get('content')
            };

            try {
                await fetch(`${API_URL}/links/${linkId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(comment)
                });

                this.fetchAndRenderComments(linkId);
                form.reset();
            } catch (error) {
                console.error('Error al enviar comentario:', error);
                alert('No se pudo enviar el comentario');
            }
        });
    },

    async voteLink(linkId, vote) {
        try {
            await fetch(`${API_URL}/links/${linkId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vote })
            });

            if (window.location.hash.startsWith('#/link/')) {
                this.renderLinkDetail(linkId);
            } else {
                await this.fetchLinks();
                this.renderLinks();
            }
        } catch (error) {
            console.error('Error al votar:', error);
            alert('No se pudo registrar el voto');
        }
    }
};

window.LinkManager = LinkManager;

// Inicializar la aplicación
window.addEventListener('DOMContentLoaded', () => {
    LinkManager.init();
});