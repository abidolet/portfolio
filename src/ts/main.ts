class Section
{
	private readonly classes =
	{
		active: 'text-cyan-400 font-bold',
		inactive: 'text-gray-400'
	}

	private readonly observerOptions =
	{
		threshold: 0.1
	};

	private sections: NodeListOf<HTMLElement> = document.querySelectorAll('section[id]');
	private navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#nav-links a');
	private observer: IntersectionObserver | null = null;

	constructor()
	{
		this.addDocumentEventListeners();
	}

	private addDocumentEventListeners(): void
	{
		document.addEventListener('DOMContentLoaded', () =>
		{
			this.createObserver();
		});

		document.addEventListener('beforeUnload', () =>
		{
			this.destroy();
		});
	}

	private createObserver(): void
	{
		try
		{
			this.observer = new IntersectionObserver((entries) =>
			{
				entries.forEach(entry =>
				{
					if (entry.isIntersecting)
					{
						this.remove();

						const id = entry.target.getAttribute('id');
						if (!id)
						{
							console.error('Section without id encountered.');
							return ;
						}

						const activeLink = document.querySelector(`#nav-links a[href="#${id}"]`) as HTMLAnchorElement;
						if (activeLink)
						{
							this.add(activeLink);
						}
						else
						{
							console.error(`No nav link found for section id: ${id}`);
						}
					}
				});
			}, this.observerOptions);

			this.sections.forEach(section =>
			{
				this.observer!.observe(section);
			});
		}
		catch (error)
		{
			console.error('Error creating IntersectionObserver:', error);
			return ;
		}
	}

	private add = (link: HTMLAnchorElement): void =>
	{
		link.classList.add(...this.classes.active.split(' '));
		link.classList.remove(...this.classes.inactive.split(' '));
	};

	private remove = (): void =>
	{
		this.navLinks.forEach(link =>
		{
			link.classList.remove(...this.classes.active.split(' '));
			link.classList.add(...this.classes.inactive.split(' '));
		});
	};

	private destroy(): void
	{
		if (this.observer)
		{
			this.sections.forEach(section =>
			{
				this.observer!.unobserve(section);
			});

			this.observer!.disconnect();
			this.observer = null;
		}
	}
}

new Section();
