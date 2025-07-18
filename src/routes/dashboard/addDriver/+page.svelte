<script lang="ts">
	let form: HTMLFormElement;
</script>

<section class="mx-auto w-[65vw] px-4 py-10 md:px-10 bg-gradient-to-br shadow-md mb-[5rem] from-gray-50 to-gray-100 min-h-screen">
	<div class="rounded-2xl bg-white p-8 shadow-xl md:p-10">
		<h1 class="mb-2 text-center text-3xl font-bold text-gray-800">Add New Driver</h1>
		<p class="mx-auto mb-10 max-w-2xl text-center text-sm text-gray-500">
			Enter the login information for your account. You will be able to create additional Drivers
			after registering.
		</p>

		<form bind:this={form} method="POST" enctype="multipart/form-data" class="space-y-10">
			<!-- Personal Info -->
			<div>
				<h2 class="mb-4 text-lg font-semibold text-gray-700">Personal Information</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="flex flex-col">
						<label for="firstName" class="text-sm font-medium text-gray-700 mb-1">First Name</label>
						<input
							id="firstName"
							name="firstName"
							placeholder="First Name"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="lastName" class="text-sm font-medium text-gray-700 mb-1">Last Name</label>
						<input
							id="lastName"
							name="lastName"
							placeholder="Last Name"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="otherName" class="text-sm font-medium text-gray-700 mb-1">Other Name</label>
						<input
							id="otherName"
							name="otherName"
							placeholder="Other Name"
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="email" class="text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="Email"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="phone" class="text-sm font-medium text-gray-700 mb-1">Phone</label>
						<input
							id="phone"
							name="phone"
							placeholder="Phone"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="dateOfBirth" class="text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
						<input
							id="dateOfBirth"
							name="dateOfBirth"
							type="date"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="gender" class="text-sm font-medium text-gray-700 mb-1">Gender</label>
						<select
							id="gender"
							name="gender"
							required
							class="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none bg-gray-50 text-gray-900"
						>
							<option value="">Select Gender</option>
							<option value="M">Male</option>
							<option value="F">Female</option>
						</select>
					</div>
					<div class="flex flex-col">
						<label for="address" class="text-sm font-medium text-gray-700 mb-1">Address</label>
						<input
							id="address"
							name="address"
							placeholder="Address"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="city" class="text-sm font-medium text-gray-700 mb-1">City</label>
						<input
							id="city"
							name="city"
							placeholder="City"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="region" class="text-sm font-medium text-gray-700 mb-1">Region</label>
						<input
							id="region"
							name="region"
							placeholder="Region"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
				</div>
			</div>

			<!-- License -->
			<div>
				<h2 class="mb-4 text-lg font-semibold text-gray-700">Driver's License</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="flex flex-col">
						<label for="licenseNumber" class="text-sm font-medium text-gray-700 mb-1">License Number</label>
						<input
							id="licenseNumber"
							name="licenseNumber"
							placeholder="License Number"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="classOfLicense" class="text-sm font-medium text-gray-700 mb-1">Class of License</label>
						<input
							id="classOfLicense"
							name="classOfLicense"
							placeholder="Class of License"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="licenseNationality" class="text-sm font-medium text-gray-700 mb-1">Nationality</label>
						<input
							id="licenseNationality"
							name="licenseNationality"
							placeholder="Nationality"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="licenseIssueDate" class="text-sm font-medium text-gray-700 mb-1">Issue Date</label>
						<input
							id="licenseIssueDate"
							name="licenseIssueDate"
							type="date"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="licenseExpiryDate" class="text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
						<input
							id="licenseExpiryDate"
							name="licenseExpiryDate"
							type="date"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
				</div>
			</div>

			<!-- Ghana Card -->
			<div>
				<h2 class="mb-4 text-lg font-medium text-gray-700">Ghana Card</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="flex flex-col">
						<label for="ghanaCardId" class="text-sm font-medium text-gray-700 mb-1">Card ID</label>
						<input
							id="ghanaCardId"
							name="ghanaCardId"
							placeholder="Card ID"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="ghanaHeight" class="text-sm font-medium text-gray-700 mb-1">Height</label>
						<input
							id="ghanaHeight"
							name="ghanaHeight"
							placeholder="Height"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="ghanaExpiryDate" class="text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
						<input
							id="ghanaExpiryDate"
							name="ghanaExpiryDate"
							type="date"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
				</div>
			</div>

			<!-- Guarantor -->
			<div>
				<h2 class="mb-4 text-lg font-semibold text-gray-700">Guarantor Information</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="flex flex-col">
						<label for="guarantorFirstName" class="text-sm font-medium text-gray-700 mb-1">First Name</label>
						<input
							id="guarantorFirstName"
							name="guarantorFirstName"
							placeholder="First Name"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorLastName" class="text-sm font-medium text-gray-700 mb-1">Last Name</label>
						<input
							id="guarantorLastName"
							name="guarantorLastName"
							placeholder="Last Name"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorOtherName" class="text-sm font-medium text-gray-700 mb-1">Other Name</label>
						<input
							id="guarantorOtherName"
							name="guarantorOtherName"
							placeholder="Other Name"
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorPhone" class="text-sm font-medium text-gray-700 mb-1">Phone</label>
						<input
							id="guarantorPhone"
							name="guarantorPhone"
							placeholder="Phone"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorEmail" class="text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							id="guarantorEmail"
							name="guarantorEmail"
							type="email"
							placeholder="Email"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorRelationship" class="text-sm font-medium text-gray-700 mb-1">Relationship</label>
						<input
							id="guarantorRelationship"
							name="guarantorRelationship"
							placeholder="Relationship"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorOccupation" class="text-sm font-medium text-gray-700 mb-1">Occupation</label>
						<input
							id="guarantorOccupation"
							name="guarantorOccupation"
							placeholder="Occupation"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorAddress" class="text-sm font-medium text-gray-700 mb-1">Address</label>
						<input
							id="guarantorAddress"
							name="guarantorAddress"
							placeholder="Address"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorLandmark" class="text-sm font-medium text-gray-700 mb-1">Landmark</label>
						<input
							id="guarantorLandmark"
							name="guarantorLandmark"
							placeholder="Landmark"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorGhanaId" class="text-sm font-medium text-gray-700 mb-1">Card ID</label>
						<input
							id="guarantorGhanaId"
							name="guarantorGhanaId"
							placeholder="Card ID"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorHeight" class="text-sm font-medium text-gray-700 mb-1">Height</label>
						<input
							id="guarantorHeight"
							name="guarantorHeight"
							placeholder="Height"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="guarantorExpiryDate" class="text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
						<input
							id="guarantorExpiryDate"
							name="guarantorExpiryDate"
							type="date"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
				</div>
			</div>

			<!-- Bike Program -->
			<div>
				<h2 class="mb-4 text-lg font-semibold text-gray-700">Bike Program</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="flex flex-col">
						<label for="bikeModel" class="text-sm font-medium text-gray-700 mb-1">Bike Model</label>
						<input
							id="bikeModel"
							name="bikeModel"
							placeholder="Bike Model"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="bikePrice" class="text-sm font-medium text-gray-700 mb-1">Bike Price</label>
						<input
							id="bikePrice"
							name="bikePrice"
							type="number"
							placeholder="Bike Price"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="paymentDuration" class="text-sm font-medium text-gray-700 mb-1">Payment Duration (12, 24, 36 months)</label>
						<input
							id="paymentDuration"
							name="paymentDuration"
							type="number"
							placeholder="Payment Duration (months)"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
					<div class="flex flex-col">
						<label for="startDate" class="text-sm font-medium text-gray-700 mb-1">Start Date</label>
						<input
							id="startDate"
							name="startDate"
							type="date"
							required
							class="w-full rounded-md border border-gray-300 px-4 py-3 outline-none bg-gray-50 text-gray-900"
						/>
					</div>
				</div>
			</div>

			<!-- File Inputs -->
			<div class="space-y-4 px-[8rem]">
				<h2 class="mb-4 text-sm font-normal text-red-700">Required Documents (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX)</h2>
				<div class="flex items-center space-x-[5rem]">
					<label for="driverLicense" class="text-sm font-medium whitespace-nowrap text-gray-700">Driver's License</label>
					<input
						id="driverLicense"
						type="file"
						name="driverLicense"
						required
						class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all outline-none file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-medium file:text-white file:transition-all"
					/>
				</div>
				<div class="flex items-center space-x-[5rem]">
					<label for="ghanaCard" class="text-sm font-medium whitespace-nowrap text-gray-700">Ghana Card</label>
					<input
						id="ghanaCard"
						type="file"
						name="ghanaCard"
						required
						class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all outline-none file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-medium file:text-white file:transition-all"
					/>
				</div>
				<div class="flex items-center space-x-[5rem]">
					<label for="proofOfAddress" class="text-sm font-medium whitespace-nowrap text-gray-700">Proof of Address</label>
					<input
						id="proofOfAddress"
						type="file"
						name="proofOfAddress"
						required
						class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all outline-none file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-medium file:text-white file:transition-all"
					/>
				</div>
				<div class="flex items-center space-x-[5rem]">
					<label for="guarantorGhanaCard" class="text-sm font-medium whitespace-nowrap text-gray-700">Guarantor Ghana Card</label>
					<input
						id="guarantorGhanaCard"
						type="file"
						name="guarantorGhanaCard"
						required
						class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all outline-none file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-medium file:text-white file:transition-all"
					/>
				</div>
				<div class="flex items-center space-x-[5rem]">
					<label for="guarantorProofOfAddress" class="text-sm font-medium whitespace-nowrap text-gray-700">Guarantor Proof of Address</label>
					<input
						id="guarantorProofOfAddress"
						type="file"
						name="guarantorProofOfAddress"
						required
						class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all outline-none file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-medium file:text-white file:transition-all"
					/>
				</div>
			</div>

			<!-- Submit -->
			<div class="flex justify-end pt-4">
				<button
					type="submit"
					class="rounded-md bg-orange-500 px-6 py-3 font-semibold text-white transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
				>
					Register Driver
				</button>
			</div>
		</form>
	</div>
</section>