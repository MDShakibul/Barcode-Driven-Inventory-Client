import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';

const KanbanBoard = () => {
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [showInput, setShowInput] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');

	const fetchData = async () => {
		const [catRes, prodRes] = await Promise.all([
			fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`).then((res) =>
				res.json()
			),
			fetch(`${import.meta.env.VITE_API_BASE_URL}/products`).then((res) =>
				res.json()
			),
		]);
		setCategories(catRes.data);
		setProducts(prodRes.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	/* const onDragEnd = async (result) => {
		const { destination, source, draggableId } = result;

		if (!destination || destination.droppableId === source.droppableId) return;

		const updatedProducts = products.map((product) =>
			product._id === draggableId
				? { ...product, category: destination.droppableId }
				: product
		);
		setProducts(updatedProducts);

		await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/products/${draggableId}`,
			{
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ category: destination.droppableId }),
			}
		);
	}; */

	const onDragEnd = async (result) => {
		const { destination, source, draggableId } = result;

		if (!destination || destination.droppableId === source.droppableId) return;

		const updatedProducts = products.map((product) =>
			product._id === draggableId
				? { ...product, category: destination.droppableId }
				: product
		);
		setProducts(updatedProducts);

		const token = localStorage.getItem('token');

		await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/products/${draggableId}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					authorization: `${token}`,
				},
				body: JSON.stringify({ category: destination.droppableId }),
			}
		);
	};

	const handleAddCategory = async () => {
		if (!newCategoryName.trim()) return;
		const token = localStorage.getItem('token');

		await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/categories/add-category`,
			{
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json', authorization: `${token}`, },
				body: JSON.stringify({ category: newCategoryName }),
			}
		);

		setNewCategoryName('');
		setShowInput(false);
		fetchData();
	};

	return (
		<div className="text-white min-h-screen">
			<div className="max-w-[1200px] mx-auto text-center flex flex-col justify-center items-center py-10">
				<h1 className="text-[#00df9a] md:text-6xl sm:text-5xl text-4xl font-bold pb-6">
					Product Kanban View
				</h1>

				<button
					onClick={() => setShowInput(!showInput)}
					className="bg-[#00df9a] text-white font-semibold px-6 py-2 rounded hover:bg-[#00c481] transition mb-6 cursor-pointer"
				>
					{showInput ? 'Cancel' : 'Add Category'}
				</button>

				{showInput && (
					<div className="flex items-center mb-6 space-x-4">
						<input
							type="text"
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
							placeholder="Enter category name"
							className="px-4 py-2  border border-black rounded text-black focus:outline-none"
						/>
						<button
							onClick={handleAddCategory}
							className="bg-[#00df9a] text-white font-semibold px-4 py-2 rounded hover:bg-[#00c481] transition cursor-pointer"
						>
							Submit
						</button>
					</div>
				)}

				<DragDropContext onDragEnd={onDragEnd}>
					<div className="flex gap-6 overflow-x-auto w-full">
						{categories.map((category) => (
							<Droppable droppableId={category._id} key={category._id}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="bg-[#fff] p-4 rounded-lg w-[250px] flex-shrink-0 shadow-md"
									>
										<h3 className="text-lg font-semibold text-[#00df9a] mb-4">
											{category.category}
										</h3>

										{products
											.filter((p) => p.category === category._id)
											.map((product, index) => (
												<Draggable
													key={product._id}
													draggableId={product._id}
													index={index}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className="bg-[#def7ef] text-black p-3 mb-3 rounded shadow cursor-move"
														>
															<p className="text-start font-bold text-[10px]">
																{product.material}
															</p>
															<p className="text-start text-sm">
																{product.description}
															</p>
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						))}
					</div>
				</DragDropContext>
			</div>
		</div>
	);
};

export default KanbanBoard;
