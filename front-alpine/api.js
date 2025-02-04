const API_URL = 'http://localhost:3000/api';

document.addEventListener('alpine:init', () => {
    Alpine.data('linkManager', () => ({
        links: [],
        comments: [],
        currentLink: null,
        
        init() {
            this.setupRouting();
            this.fetchLinks();
        },

        setupRouting() {
            window.addEventListener('hashchange', () => this.handleRoute());
            this.handleRoute();
        },

        handleRoute() {
            const hash = window.location.hash;
            if (hash.startsWith('#/link/')) {
                const linkId = hash.split('/')[2];
                this.renderLinkDetail(linkId);
            } else {
                this.currentLink = null;
            }
        },

        async fetchLinks() {
            try {
                const response = await fetch(`${API_URL}/links`);
                const data = await response.json();
                this.links = data.links;
            } catch (error) {
                console.error('Error fetching links:', error);
            }
        },

        get filteredLinks() {
            const filterValue = this.$refs.tagFilter?.value.toLowerCase() || '';
            if (!filterValue) return this.links;
            return this.links.filter(link => 
                link.tags.some(tag => tag.toLowerCase().includes(filterValue))
            );
        },

        async createLink(event) {
            event.preventDefault();
            const form = event.target;
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
                form.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo crear el enlace');
            }
        },

        async voteLink(linkId, vote) {
            try {
                await fetch(`${API_URL}/links/${linkId}/vote`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vote })
                });

                if (this.currentLink?.id === linkId) {
                    await this.renderLinkDetail(linkId);
                } else {
                    await this.fetchLinks();
                }
            } catch (error) {
                console.error('Error al votar:', error);
                alert('No se pudo registrar el voto');
            }
        },

        async editLink(link) {
            const newTitle = prompt('Editar título', link.title);
            const newUrl = prompt('Editar URL', link.url);
            const newDescription = prompt('Editar descripción', link.description);
            const newTags = prompt('Editar tags (separadas por coma)', link.tags.join(','));

            if (newTitle && newUrl) {
                try {
                    await fetch(`${API_URL}/links/${link.id}`, {
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
                } catch (error) {
                    console.error('Error:', error);
                    alert('No se pudo editar el enlace');
                }
            }
        },

        async deleteLink(linkId) {
            if (!confirm('¿Estás seguro de eliminar este enlace?')) return;
            
            try {
                await fetch(`${API_URL}/links/${linkId}`, {
                    method: 'DELETE'
                });
                await this.fetchLinks();
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo eliminar el enlace');
            }
        },

        async renderLinkDetail(linkId) {
            try {
                const response = await fetch(`${API_URL}/links/${linkId}`);
                const data = await response.json();
                this.currentLink = data.link;
                await this.fetchComments(linkId);
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo cargar el detalle del enlace');
            }
        },

        async fetchComments(linkId) {
            try {
                const response = await fetch(`${API_URL}/links/${linkId}/comments`);
                const data = await response.json();
                this.comments = data.comments;
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async addComment(event) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            
            try {
                await fetch(`${API_URL}/links/${this.currentLink.id}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.get('email'),
                        content: formData.get('content')
                    })
                });

                await this.fetchComments(this.currentLink.id);
                form.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo añadir el comentario');
            }
        }
    }));
}); 