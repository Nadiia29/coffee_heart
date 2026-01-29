document.addEventListener('DOMContentLoaded', () => {
	/* ======================
	   MENU
	====================== */

	const menuItems = [
		{ name: 'Еспресо', category: 'coffee', price: 45 },
		{ name: 'Капучино', category: 'coffee', price: 65 },
		{ name: 'Лате', category: 'coffee', price: 70 },
		{ name: 'Американо', category: 'coffee', price: 50 },

		{ name: 'Зелений чай', category: 'tea', price: 40 },
		{ name: 'Чорний чай', category: 'tea', price: 40 },

		{ name: 'Тірамісу', category: 'desserts', price: 70 },
		{ name: 'Чізкейк', category: 'desserts', price: 80 },
		{ name: 'Круасан', category: 'desserts', price: 55 },
	];

	const galleryImages = [
		{ src: 'img/1.jpg', alt: 'Кава' },
		{ src: 'img/2.jpg', alt: "Інтер'єр кав'ярні" },
		{ src: 'img/3.jpg', alt: 'Кава' },
		{ src: 'img/4.jpg', alt: 'Кава' },
		{ src: 'img/5.jpg', alt: 'Затишний куточок' },
		{ src: 'img/6.jpg', alt: 'Застілля' },
		{ src: 'img/7.jpeg', alt: 'Солодощі' },
		{ src: 'img/kava.jpg', alt: 'Кава' },
	];

	const menuGrid = document.getElementById('menu-grid');
	const filterButtons = document.querySelectorAll('.menu-filters button');

	function renderMenu(items) {
		menuGrid.innerHTML = '';

		items.forEach((item) => {
			const div = document.createElement('div');
			div.className = 'menu-item';

			div.innerHTML = `
				<h3>${item.name}</h3>
				<p>${item.price} грн</p>
			`;

			div.addEventListener('click', () => {
				document.querySelectorAll('.menu-item').forEach((el) => {
					el.classList.remove('active');
				});
				div.classList.add('active');
			});

			menuGrid.appendChild(div);
		});
	}

	function setActiveButton(activeButton) {
		filterButtons.forEach((btn) => btn.classList.remove('active'));
		activeButton.classList.add('active');
	}

	function filterMenu(category) {
		const filtered =
			category === 'all' ? menuItems : menuItems.filter((item) => item.category === category);

		renderMenu(filtered);
	}

	filterButtons.forEach((button) => {
		button.addEventListener('click', () => {
			setActiveButton(button);
			filterMenu(button.dataset.category);
		});
	});

	renderMenu(menuItems);

	const burger = document.querySelector('.burger');
	const navLinks = document.querySelector('.nav-links');

	burger.addEventListener('click', () => {
		navLinks.classList.toggle('active');
		burger.classList.toggle('toggle');
	});

	navLinks.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			if (navLinks.classList.contains('active')) {
				navLinks.classList.remove('active');
				burger.classList.remove('toggle');
			}
		});
	});

	/* ======================
	   ORDER TYPE SWITCH
	====================== */

	const typeButtons = document.querySelectorAll('.type-btn');
	const takeawayFields = document.querySelectorAll('.takeaway-field');
	const tableFields = document.querySelectorAll('.table-field');

	let currentOrderType = 'takeaway';

	function setOrderType(type) {
		currentOrderType = type;

		typeButtons.forEach((btn) => {
			btn.classList.toggle('active', btn.dataset.type === type);
		});

		if (type === 'takeaway') {
			takeawayFields.forEach((field) => {
				field.classList.remove('hidden');
				field.querySelectorAll('input, select').forEach((input) => {
					if (input.id !== 'product') {
						input.setAttribute('required', '');
					}
				});
			});

			tableFields.forEach((field) => {
				field.classList.add('hidden');
				field.querySelectorAll('input, select').forEach((input) => {
					input.removeAttribute('required');
					input.value = '';
				});
			});
		} else {
			takeawayFields.forEach((field) => {
				field.classList.add('hidden');
				field.querySelectorAll('input, select').forEach((input) => {
					input.removeAttribute('required');
					input.value = '';
				});
			});

			tableFields.forEach((field) => {
				field.classList.remove('hidden');
				field.querySelectorAll('input, select').forEach((input) => {
					input.setAttribute('required', '');
				});
			});
		}
	}

	typeButtons.forEach((button) => {
		button.addEventListener('click', () => {
			setOrderType(button.dataset.type);
		});
	});

	setOrderType('takeaway');

	/* ======================
	   ORDER FORM (SIMPLE VERSION)
	====================== */

	const orderForm = document.getElementById('order-form');
	const nameInput = document.getElementById('name');
	const phoneInput = document.getElementById('phone');
	const productSelect = document.getElementById('product');
	const totalPriceEl = document.getElementById('total-price');

	function updateTotalPrice() {
		// Отримуємо всі обрані позиції
		const selectedOptions = Array.from(productSelect.selectedOptions);

		if (selectedOptions.length === 0) {
			totalPriceEl.textContent = '0';
			return;
		}

		// Підраховуємо загальну суму
		let total = 0;
		selectedOptions.forEach((option) => {
			const price = Number(option.dataset.price);
			total += price;
		});

		totalPriceEl.textContent = total;
	}

	productSelect.addEventListener('change', updateTotalPrice);

	orderForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const name = nameInput.value.trim();
		const phone = phoneInput.value.trim();

		if (!name || !phone) {
			alert('Заповніть імʼя та телефон');
			return;
		}

		let message = `Замовлення:\nІмʼя: ${name}\nТелефон: ${phone}\n\n`;

		if (currentOrderType === 'takeaway') {
			const selectedOptions = Array.from(productSelect.selectedOptions);

			if (selectedOptions.length === 0) {
				alert('Оберіть хоча б одну позицію з меню');
				return;
			}

			const time = document.getElementById('pickup-time').value;
			if (!time) {
				alert('Оберіть час отримання');
				return;
			}

			message += `Тип: З собою\n\nЗамовлення:\n`;

			let total = 0;
			selectedOptions.forEach((option) => {
				const name = option.textContent.split('—')[0].trim();
				const price = Number(option.dataset.price);
				message += `- ${name} — ${price} грн\n`;
				total += price;
			});

			message += `\nЗагальна сума: ${total} грн\nЧас отримання: ${time}`;
		} else {
			const date = document.getElementById('date').value;
			const time = document.getElementById('time').value;
			const guests = document.getElementById('guests').value;

			if (!date || !time) {
				alert('Оберіть дату та час');
				return;
			}

			message += `Тип: Бронювання столика\nДата: ${date}\nЧас: ${time}\nГостей: ${guests}`;
		}

		const successModal = document.getElementById('success-modal');
		const modalMessage = document.getElementById('modal-message');
		const modalClose = document.getElementById('modal-close');
		const modalOk = document.getElementById('modal-ok');

		function openModal(message) {
			modalMessage.textContent = message;
			successModal.classList.remove('hidden');
		}

		function closeModal() {
			successModal.classList.add('hidden');
		}

		modalClose.addEventListener('click', closeModal);
		modalOk.addEventListener('click', closeModal);

		successModal.addEventListener('click', (e) => {
			if (e.target === successModal) closeModal();
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closeModal();
		});

		openModal(message);
		orderForm.reset();
		updateTotalPrice();
		setOrderType('takeaway');
	});

	/* ======================
  	 GALLERY
	====================== */

	const galleryGrid = document.getElementById('gallery-grid');

	function renderGallery() {
		galleryGrid.innerHTML = '';

		galleryImages.forEach((image, index) => {
			const div = document.createElement('div');
			div.className = 'gallery-item';

			const img = document.createElement('img');
			img.src = image.src;
			img.alt = image.alt;

			img.addEventListener('click', () => {
				openLightbox(index);
			});

			div.appendChild(img);
			galleryGrid.appendChild(div);
		});
	}

	renderGallery();

	/* ======================
  	 LIGHTBOX
	====================== */

	const lightbox = document.getElementById('lightbox');
	const lightboxImage = document.getElementById('lightbox-image');
	const lightboxClose = document.getElementById('lightbox-close');

	let currentImageIndex = 0;

	function openLightbox(index) {
		currentImageIndex = index;
		lightboxImage.src = galleryImages[index].src;
		lightboxImage.alt = galleryImages[index].alt;
		lightbox.classList.remove('hidden');
	}

	function closeLightbox() {
		lightbox.classList.add('hidden');
	}

	lightboxClose.addEventListener('click', closeLightbox);

	lightbox.addEventListener('click', (e) => {
		if (e.target === lightbox) {
			closeLightbox();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeLightbox();
		}
	});
});
